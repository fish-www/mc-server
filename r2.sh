#!/usr/bin/env bash
# 依据 server-manifest.json 把 client/ 与 server/ 下的客户端整合包文件上传到 r2
# 只会上传 manifest 里列出的文件；manifest 是客户端文件清单的唯一真源
# 同一条包内路径 client/ 优先，找不到再取 server/（与 scripts/update-manifest.py 一致）
set -euo pipefail
cd "$(dirname "$0")"

MANIFEST="server-manifest.json"
REMOTE="r2:fish-share/mc/aer/modpack"

python3 - "$MANIFEST" <<'PY'
import hashlib, json, os, sys

manifest_path = sys.argv[1]
ROOTS = ("client", "server")            # 解析顺序：client/ 优先，server/ 兜底


def locate(rel):
    for root in ROOTS:
        path = os.path.join(root, rel)
        if os.path.isfile(path):
            return root, path
    return None, None


def sha1(path):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


with open(manifest_path, encoding="utf-8") as f:
    manifest = json.load(f)

missing = []
uploads = {root: [] for root in ROOTS}
changed = 0
for e in manifest["files"]:
    root, path = locate(e["path"])
    if root is None:
        missing.append(e["path"])
        continue
    uploads[root].append(e["path"])
    digest = sha1(path)
    if digest != e["hash"]:
        e["hash"] = digest
        changed += 1

if missing:
    print("错误：manifest 中以下文件在 client/ 与 server/ 下都不存在：", file=sys.stderr)
    for p in missing:
        print("  " + p, file=sys.stderr)
    sys.exit(1)

if changed:
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=4)
        f.write("\n")
    print(f"已刷新 {changed} 个文件的 sha1")

for root in ROOTS:
    out = f"/tmp/r2-upload-{root}.txt"
    with open(out, "w") as f:
        if uploads[root]:
            f.write("\n".join(uploads[root]) + "\n")
    print(f"{root}: 待上传 {len(uploads[root])} 个文件")
PY

# 上传文件（HMCL 协议要求文件落在 <fileApi>/overrides/<path>）
for root in client server; do
  list="/tmp/r2-upload-$root.txt"
  if [ -s "$list" ]; then
    rclone copy "$root" "$REMOTE/overrides" --files-from "$list" -P
  fi
done
# 上传 manifest 本体（<fileApi>/server-manifest.json）
rclone copy "$MANIFEST" "$REMOTE" -P
