#!/usr/bin/env python3
"""Build an up-to-date copy of the server-side mods directory.

The server mods directory is a subset of the client modpack: it keeps the mods
the server needs (including server-only ones) but should have the same mod
versions as the modpack. This script uses the server mods directory as the
template for WHICH mods to keep, the modpack mods directory as the source of
the newest versions, and writes the result to an output directory:

    --template  mods          which mods to keep (their versions are ignored)
    --source    server/mods   newest version of every mod
    --out       mods-new      result, recreated from scratch

Mods are matched per mod, so a version bump swaps the copied file but never
adds or drops a mod: first by file name, then by the name with the mod version
removed, then by mod id when the source has exactly one file for it. When two
template files resolve to the same source file (same mod, two old versions)
only that file is written. Files whose mod is missing from the source are
copied unchanged, and a ".disabled" suffix is kept.

With --diff the old -> new file names are taken from the diff of a
server-manifest.json commit (the manifest lists the modpack files, so its diff
is the authoritative rename list); the mod id read from both jars is used to
check the mapping. This is only needed for renames the matching rules cannot
recognise.

Usage:
    python3 scripts/sync-server-mods.py [--template mods] [--source server/mods]
                                        [--out mods-new] [--diff REV] [--dry-run]
    python3 scripts/sync-server-mods.py --selftest
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from collections import defaultdict
from zipfile import ZipFile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DISABLED = ".disabled"
MOD_META = ("META-INF/neoforge.mods.toml", "META-INF/mods.toml")
MOD_ID_RE = re.compile(r"""modId\s*=\s*["']([^"']+)["']""")
MOD_VERSION_RE = re.compile(r"""version\s*=\s*["']([^"']+)["']""")


def base_name(path: str) -> str:
    """File name without a trailing .disabled."""
    name = os.path.basename(path)
    return name[: -len(DISABLED)] if name.endswith(DISABLED) else name


def read_metadata(path: str):
    """Return (own mod ids, all mod ids, version) read from the jar metadata."""
    try:
        with ZipFile(path) as jar:
            names = set(jar.namelist())
            for name in MOD_META:
                if name in names:
                    text = jar.read(name).decode("utf-8", "replace")
                    # [[mods]] sections come first, [[dependencies.*]] after them
                    own = MOD_ID_RE.findall(text.split("[[dependencies")[0])
                    version = MOD_VERSION_RE.findall(text)
                    return own, MOD_ID_RE.findall(text), version[0] if version else ""
            if "fabric.mod.json" in names:
                data = json.loads(jar.read("fabric.mod.json").decode("utf-8", "replace"))
                ids = [data["id"]] if isinstance(data.get("id"), str) else []
                return ids, ids, str(data.get("version", ""))
    except Exception:  # unreadable jar: fall back to name based matching
        pass
    return [], [], ""


def version_key(version: str):
    """Sortable key: numeric parts compare as numbers, so 5.13.1 > 5.12.1."""
    return tuple(
        (0, int(part)) if part.isdigit() else (1, part)
        for part in re.split(r"[^0-9A-Za-z]+", version)
        if part
    )


def stem(name: str, version: str) -> str:
    """File name with the mod version removed, used to match renamed files."""
    base = name[:-4] if name.lower().endswith(".jar") else name
    if version:
        for candidate in (version, "v" + version.lstrip("v")):
            cut = base.rfind(candidate)
            if cut >= 0:
                base = base[:cut] + base[cut + len(candidate):]
                break
    return re.sub(r"[^0-9a-z]", "", base.lower())


def collect(directory: str):
    """Read a mods directory into a list of entries."""
    entries = []
    for name in sorted(os.listdir(directory)):
        path = os.path.join(directory, name)
        if not os.path.isfile(path):
            print(f"warning: ignoring {path}: not a regular file", file=sys.stderr)
            continue
        own, all_ids, version = read_metadata(path)
        flat = re.sub(r"[^0-9a-z]", "", name.lower())
        named = [i for i in own + all_ids if re.sub(r"[^0-9a-z]", "", i.lower()) in flat]
        ids = named or own or all_ids
        entries.append(
            {
                "path": path,
                "name": base_name(path),
                "disabled": name.endswith(DISABLED),
                "mod_id": max(ids, key=len).lower() if ids else None,
                "stem": stem(base_name(path), version),
                "version": version,
            }
        )
    return entries


def same_mod(one, other) -> bool:
    return bool(one["mod_id"]) and one["mod_id"] == other["mod_id"]


def newest(candidates):
    return max(candidates, key=lambda e: (version_key(e["version"]), e["name"]))


def diff_mapping(rev: str, prefix: str) -> dict:
    """old file name -> new file name, from the diff of a manifest commit."""
    result = subprocess.run(
        ["git", "show", "--format=", "--unified=0", rev, "--", "server-manifest.json"],
        cwd=ROOT, capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f"git show {rev} failed")
    removed = re.findall(r'^[-].*"path": "([^"]+)"', result.stdout, re.M)
    added = re.findall(r'^[+].*"path": "([^"]+)"', result.stdout, re.M)
    mapping = {}
    for old, new in zip(removed, added):
        if old != new and old.startswith(prefix) and new.startswith(prefix):
            mapping[os.path.basename(old)] = os.path.basename(new)
    return mapping


def build_plan(template, source, mapping=None):
    """Pair every template entry with a source entry. Returns (plan, used source paths)."""
    mapping = mapping or {}
    by_name = {e["name"]: e for e in source}
    by_stem = defaultdict(list)
    by_mod_id = defaultdict(list)
    for entry in source:
        by_stem[entry["stem"]].append(entry)
        if entry["mod_id"]:
            by_mod_id[entry["mod_id"]].append(entry)

    def resolve(entry):
        """Pick the source entry for a template entry that has no identical file name."""
        mapped = mapping.get(entry["name"])
        if mapped is not None:
            candidate = by_name.get(mapped)
            if candidate is None:
                print(f"warning: {entry['name']}: the diff maps it to {mapped}, "
                      f"which is not in the source, matching by name", file=sys.stderr)
            elif entry["mod_id"] and candidate["mod_id"] and candidate["mod_id"] != entry["mod_id"]:
                print(f"warning: {entry['name']}: the diff maps it to {mapped}, which is mod "
                      f"{candidate['mod_id']} instead of {entry['mod_id']}, ignoring the diff",
                      file=sys.stderr)
            else:
                return candidate, "update"
        candidates = by_stem.get(entry["stem"], [])
        if not candidates and entry["mod_id"] and len(by_mod_id[entry["mod_id"]]) == 1:
            # jar names the rules cannot line up (e.g. version="${file.jarVersion}"):
            # only trust a mod id when the source has exactly one file for it, so a
            # mod id shared by several jars (patched jars) stays ambiguous
            candidates = by_mod_id[entry["mod_id"]]
        if not candidates:
            return None, "copied"
        same_version = [c for c in candidates if entry["version"] and c["version"] == entry["version"]]
        return newest(same_version or candidates), "update"

    plans = {}
    used = set()
    # identical file names first, so a leftover old version is the one merged away
    for index, entry in enumerate(template):
        chosen = by_name.get(entry["name"])
        if chosen is not None:
            used.add(chosen["path"])
            plans[index] = {"action": "keep", "name": os.path.basename(entry["path"]),
                            "src": chosen["path"],
                            "out": chosen["name"] + (DISABLED if entry["disabled"] else "")}
    for index, entry in enumerate(template):
        if index in plans:
            continue
        chosen, action = resolve(entry)
        if chosen is None:
            plans[index] = {"action": "copied", "name": os.path.basename(entry["path"]), "src": None,
                            "out": os.path.basename(entry["path"])}
            continue
        out_name = chosen["name"] + (DISABLED if entry["disabled"] else "")
        if chosen["path"] in used:
            if same_mod(entry, chosen):
                plans[index] = {"action": "merged", "name": os.path.basename(entry["path"]),
                                "src": chosen["path"], "out": out_name}
            else:
                print(f"warning: {entry['name']} and an earlier mod both match "
                      f"{chosen['name']}, keeping {entry['name']} as is", file=sys.stderr)
                plans[index] = {"action": "copied", "name": os.path.basename(entry["path"]), "src": None,
                                "out": os.path.basename(entry["path"])}
            continue
        used.add(chosen["path"])
        plans[index] = {"action": action, "name": os.path.basename(entry["path"]),
                        "src": chosen["path"], "out": out_name}
    return [plans[i] for i in range(len(template))], used


def check_paths(template: str, source: str, out: str) -> str:
    """Refuse an output directory that would clobber the input directories."""
    out_abs = os.path.abspath(out)
    if os.path.dirname(out_abs) == out_abs:
        return f"refusing to use a filesystem root as output: {out}"
    for label, path in (("template", template), ("source", source)):
        path_abs = os.path.abspath(path)
        if out_abs == path_abs or path_abs.startswith(out_abs + os.sep):
            return f"output directory must not be/contain the {label} directory: {out}"
    return ""


def run(template_dir: str, source_dir: str, out_dir: str, dry_run: bool, mapping=None) -> int:
    template, source = collect(template_dir), collect(source_dir)
    plan, used = build_plan(template, source, mapping)

    for entry in plan:
        if entry["action"] == "update":
            print(f"update  {entry['name']}  ->  {entry['out']}")
        elif entry["action"] == "merged":
            print(f"merge   {entry['name']}  (superseded by {entry['out']})")
        elif entry["action"] == "copied":
            print(f"copy    {entry['name']}  (not in source, kept as is)")

    counts = defaultdict(int)
    for entry in plan:
        counts[entry["action"]] += 1
    total = len(plan) - counts["merged"]
    print(
        f"\n{out_dir}: {len(template)} -> {total} files ({counts['update']} updated, "
        f"{counts['keep']} unchanged, {counts['copied']} copied as is, {counts['merged']} merged)"
    )
    unused = [e["name"] for e in source if e["path"] not in used]
    if unused:
        print(f"{len(unused)} files of {source_dir} are not in {template_dir} "
              f"(client-only mods, not added):")
        for name in unused:
            print(f"  {name}")
    if dry_run:
        print("\ndry run: nothing written")
        return 0

    if os.path.exists(out_dir):
        shutil.rmtree(out_dir)
    os.makedirs(out_dir)
    written = 0
    for entry in plan:
        if entry["action"] == "merged":
            continue
        src = entry["src"] or os.path.join(template_dir, entry["out"])
        shutil.copy2(src, os.path.join(out_dir, entry["out"]))
        written += 1
    if written != total:
        print(f"error: wrote {written} files, expected {total}", file=sys.stderr)
        return 1
    print(f"wrote -> {out_dir} ({written} files)")
    return 0


def selftest() -> int:
    """Check the matching rules on a throwaway fixture."""
    import tempfile

    def jar(path, mod_id=None, version=None):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        if mod_id is None:
            ZipFile(path, "w").writestr("hello.txt", "not a mod")
            return
        toml = 'modLoader="javafml"\n[[mods]]\nmodId="%s"\nversion="%s"\n' % (mod_id, version)
        toml += '[[dependencies.%s]]\nmodId="minecraft"\nversionRange="[1.21,1.22)"\n' % mod_id
        with ZipFile(path, "w") as z:
            z.writestr("META-INF/neoforge.mods.toml", toml)

    def prepare(root, files):
        for name, args in files.items():
            jar(os.path.join(root, name), *args)

    with tempfile.TemporaryDirectory() as tmp:
        template, source = os.path.join(tmp, "mods"), os.path.join(tmp, "source")
        prepare(template, {
            "foo-1.0.0.jar": ("foo", "1.0.0"),          # new version in source
            "old-0.9.0.jar": ("old", "0.9.0"),          # same mod as old-1.0.0
            "old-1.0.0.jar": ("old", "1.0.0"),
            "renamed-1.0.0.jar": ("renamed", "1.0.0"),  # source uses another name
            "srvonly-1.0.jar": ("srvonly", "1.0"),      # server-only, not in source
            "off-1.0.jar.disabled": ("off", "1.0"),     # disabled, new version in source
            "patch-1.0.jar": ("base", "1.0"),           # two files share mod id "base"
            "base-1.0.jar": ("base", "1.0"),
            "plain-1.0.jar": (None,),
            "twice-a.jar": ("twice", "1.0.0"),          # both versions in both dirs
            "twice-b.jar": ("twice", "1.0.0"),
            "wonky-1.0.jar": ("wonky", "1.0"),          # renamed beyond recognition
            "wonky-also-1.0.jar": ("wonky", "1.0"),     # only the diff can match this one
            "alpha-new.jar": ("alpha", "${file.jarVersion}"),  # no version in the metadata
            "alpha-old.jar": ("alpha", "${file.jarVersion}"),
        })
        prepare(source, {
            "foo-2.0.0.jar": ("foo", "2.0.0"),
            "old-1.0.0.jar": ("old", "1.0.0"),
            "renamed_1.0.0.jar": ("renamed", "1.0.0"),
            "off-2.0.jar": ("off", "2.0"),
            "patch-2.0.jar": ("base", "2.0"),
            "base-2.0.jar": ("base", "2.0"),
            "plain-1.0.jar": (None,),
            "twice-a.jar": ("twice", "1.0.0"),
            "twice-b.jar": ("twice", "1.0.0"),
            "client-only-1.0.jar": ("client", "1.0"),
            "wonky-2.0.jar": ("wonky", "2.0"),
            "finished-2.0.jar": ("wonky", "2.0"),
            "alpha-9.0.jar": ("alpha", "${file.jarVersion}"),
        })
        expected = {
            "foo-1.0.0.jar": ("update", "foo-2.0.0.jar"),
            "old-0.9.0.jar": ("merged", "old-1.0.0.jar"),
            "old-1.0.0.jar": ("keep", "old-1.0.0.jar"),
            "renamed-1.0.0.jar": ("update", "renamed_1.0.0.jar"),
            "srvonly-1.0.jar": ("copied", "srvonly-1.0.jar"),
            "off-1.0.jar.disabled": ("update", "off-2.0.jar.disabled"),
            "patch-1.0.jar": ("update", "patch-2.0.jar"),
            "base-1.0.jar": ("update", "base-2.0.jar"),
            "plain-1.0.jar": ("keep", "plain-1.0.jar"),
            "twice-a.jar": ("keep", "twice-a.jar"),
            "twice-b.jar": ("keep", "twice-b.jar"),
            "wonky-1.0.jar": ("update", "wonky-2.0.jar"),
            "wonky-also-1.0.jar": ("update", "finished-2.0.jar"),
            "alpha-new.jar": ("update", "alpha-9.0.jar"),
            "alpha-old.jar": ("merged", "alpha-9.0.jar"),
        }
        # the diff mapping wins over name matching; a mod id mismatch is refused,
        # so patch-1.0.jar must not follow its (deliberately wrong) mapping
        mapping = {
            "wonky-also-1.0.jar": "finished-2.0.jar",
            "patch-1.0.jar": "off-2.0.jar",
        }
        plan, _ = build_plan(collect(template), collect(source), mapping)
        got = {e["name"]: (e["action"], e["out"]) for e in plan}
        if got != expected:
            for name in sorted(set(got) | set(expected)):
                if got.get(name) != expected.get(name):
                    print(f"FAIL {name}: got {got.get(name)}, want {expected.get(name)}")
            return 1
        out = os.path.join(tmp, "out")
        if run(template, source, out, dry_run=False, mapping=mapping) != 0:
            print("FAIL: run() reported an error")
            return 1
        written = sorted(os.listdir(out))
        if len(written) != 13:
            print(f"FAIL: {len(written)} files written, expected 13: {written}")
            return 1
        if not all(os.path.getsize(os.path.join(out, n)) > 0 for n in written):
            print("FAIL: empty file written")
            return 1
    print("selftest ok")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--template", default=os.path.join(ROOT, "mods"),
                        help="server mods directory: which mods to keep (default: mods)")
    parser.add_argument("--source", default=os.path.join(ROOT, "server", "mods"),
                        help="modpack mods directory: newest versions (default: server/mods)")
    parser.add_argument("--out", default=os.path.join(ROOT, "mods-new"),
                        help="output directory, recreated from scratch (default: mods-new)")
    parser.add_argument("--dry-run", action="store_true", help="only print what would be done")
    parser.add_argument("--diff", metavar="REV",
                        help="take old->new file names from this server-manifest.json commit")
    parser.add_argument("--selftest", action="store_true", help="check the matching rules")
    args = parser.parse_args()

    if args.selftest:
        return selftest()
    error = check_paths(args.template, args.source, args.out)
    if error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    for label, path in (("template", args.template), ("source", args.source)):
        if not os.path.isdir(path):
            print(f"error: {label} directory does not exist: {path}", file=sys.stderr)
            return 1
    mapping = {}
    if args.diff:
        prefix = os.path.basename(os.path.normpath(args.template)) + "/"
        try:
            mapping = diff_mapping(args.diff, prefix)
        except RuntimeError as exc:
            print(f"error: {exc}", file=sys.stderr)
            return 1
        print(f"{args.diff}: {len(mapping)} renamed mod files from server-manifest.json")
    return run(args.template, args.source, args.out, args.dry_run, mapping)


if __name__ == "__main__":
    sys.exit(main())
