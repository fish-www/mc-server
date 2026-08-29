#!/usr/bin/env python3
"""Sort a manifest JSON's "files" array by path, in place.

Replaces the old jq-based sort.sh. Sort order matches jq's sort_by(.path):
lexicographic by path string.

Usage:
    python3 sort.py manifest.json [manifest2.json ...]
"""

import json
import sys


def main() -> int:
    if len(sys.argv) < 2:
        print(f"usage: {sys.argv[0]} manifest.json [manifest2.json ...]", file=sys.stderr)
        return 1

    for path in sys.argv[1:]:
        with open(path, encoding="utf-8") as f:
            manifest = json.load(f)
        files = manifest.get("files", [])
        files.sort(key=lambda e: e.get("path", ""))
        with open(path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=4)
            f.write("\n")
        print(f"sorted {path}: {len(files)} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
