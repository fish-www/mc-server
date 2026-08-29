#!/usr/bin/env bash
# 依据 server-manifest.json 把 server/ 下的客户端整合包文件上传到 r2
# 只会上传 manifest 里列出的文件；manifest 是客户端文件清单的唯一真源
set -euo pipefail
cd "$(dirname "$0")"

MANIFEST="server-manifest.json"
CONTENT="server"
REMOTE="r2:fish-share/mc/aer/modpack"

python3 - "$MANIFEST" "$CONTENT" <<'PY'
import hashlib, json, os, sys

manifest_path, content = sys.argv[1], sys.argv[2]

with open(manifest_path, encoding="utf-8") as f:
    manifest = json.load(f)

missing = [
    e["path"] for e in manifest["files"]
    if not os.path.isfile(os.path.join(content, e["path"]))
]
if missing:
    print("错误：manifest 中以下文件在 server/ 下不存在：", file=sys.stderr)
    for p in missing:
        print("  " + p, file=sys.stderr)
    sys.exit(1)

changed = 0
for e in manifest["files"]:
    h = hashlib.sha1()
    with open(os.path.join(content, e["path"]), "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    digest = h.hexdigest()
    if digest != e["hash"]:
        e["hash"] = digest
        changed += 1

if changed:
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=4)
        f.write("\n")
    print(f"已刷新 {changed} 个文件的 sha1")

with open("/tmp/r2-upload-list.txt", "w") as f:
    f.write("\n".join(e["path"] for e in manifest["files"]) + "\n")
print(f"待上传 {len(manifest['files'])} 个文件")
PY

# 上传文件（HMCL 协议要求文件落在 <fileApi>/overrides/<path>）
rclone copy "$CONTENT" "$REMOTE/overrides" --files-from /tmp/r2-upload-list.txt -P
# 上传 manifest 本体（<fileApi>/server-manifest.json）
rclone copy "$MANIFEST" "$REMOTE" -P
