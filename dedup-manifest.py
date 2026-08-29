#!/usr/bin/env python3
"""Remove duplicate entries in a modpack manifest's "files" array.

Deduplicates by "path" (keeping the first occurrence). Files with the same
hash but different paths are kept -- each path still needs to be downloaded.

Usage:
    python dedup-manifest.py [manifest.json] [output.json]
Defaults: input=server-manifest.json  output=the same file (in place)
Pass a different output path to keep the original intact.
"""

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def main() -> int:
    manifest_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "server-manifest.json")
    output = sys.argv[2] if len(sys.argv) > 2 else manifest_path

    if not os.path.isfile(manifest_path):
        print(f"error: no such file: {manifest_path}", file=sys.stderr)
        return 1

    with open(manifest_path, encoding="utf-8") as f:
        manifest = json.load(f)

    files = manifest.get("files", [])
    seen = set()
    kept = []
    removed = []
    for entry in files:
        path = entry.get("path")
        if path in seen:
            removed.append(path)
            continue
        seen.add(path)
        kept.append(entry)

    kept.sort(key=lambda e: e.get("path", ""))
    manifest["files"] = kept
    with open(output, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=4)
        f.write("\n")

    in_place = os.path.abspath(output) == os.path.abspath(manifest_path)
    print(f"{manifest_path}: {len(files)} -> {len(kept)} entries ({len(removed)} removed)")
    print(f"wrote -> {output}" + (" (in place)" if in_place else ""))
    for p in removed[:20]:
        print(f"  removed: {p}")
    if len(removed) > 20:
        print(f"  ... and {len(removed) - 20} more")
    return 0


if __name__ == "__main__":
    sys.exit(main())
