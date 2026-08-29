#!/usr/bin/env python3
"""Update server-manifest.json entries for given server/ files.

Usage:
    python3 scripts/update-manifest.py server/config/foo.toml [server/kubejs/bar.json ...]

For each given path (repo-root relative like server/config/foo.toml, or
manifest-relative like config/foo.toml):
  - file exists on disk  -> refresh its sha1 hash, or add a new entry if absent
  - file does not exist  -> remove the entry from the manifest

Runs dedup + sort afterwards (scripts/dedup-manifest.py).
"""

import hashlib
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MANIFEST = os.path.join(ROOT, "server-manifest.json")
CONTENT = os.path.join(ROOT, "server")


def sha1(path: str) -> str:
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    if len(sys.argv) < 2:
        print(f"usage: {sys.argv[0]} server/<path> [server/<path> ...]", file=sys.stderr)
        return 1

    with open(MANIFEST, encoding="utf-8") as f:
        manifest = json.load(f)

    files = manifest.setdefault("files", [])
    by_path = {e["path"]: e for e in files}

    for arg in sys.argv[1:]:
        rel = arg.replace("\\", "/")
        while rel.startswith("./"):
            rel = rel[2:]
        if rel.startswith("server/"):
            rel = rel[len("server/"):]
        disk = os.path.join(CONTENT, rel)
        exists = os.path.isfile(disk)

        if exists:
            digest = sha1(disk)
            if rel in by_path:
                old = by_path[rel]["hash"]
                by_path[rel]["hash"] = digest
                print(f"updated {rel}: {old[:8]} -> {digest[:8]}")
            else:
                files.append({"path": rel, "hash": digest})
                by_path[rel] = files[-1]
                print(f"added   {rel}: {digest[:8]}")
        else:
            if rel in by_path:
                files.remove(by_path[rel])
                del by_path[rel]
                print(f"removed {rel} (file missing)")
            else:
                print(f"skipped {rel}: not on disk and not in manifest")

    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=4)
        f.write("\n")

    # dedup + sort
    subprocess.run([sys.executable, os.path.join(HERE, "dedup-manifest.py"), MANIFEST], check=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
