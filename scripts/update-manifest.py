#!/usr/bin/env python3
"""按 server-manifest.json 刷新清单（哈希 / 新增 / 删除），随后去重排序。

源文件解析规则：包内相对路径先找 client/，找不到再找 server/。
即 client/ 放仅客户端文件（覆盖层），server/ 放服务端文件和服务端/客户端通用文件。
所以某个 mod 只存在于 server/mods 时照样进包，一旦 client/mods 出现同名文件就以它为准。

忽略清单（仓根 .packignore，可选）：
  一行一条包内相对路径，`#` 起注释，空行跳过；写成 `mods/x.jar` 或 `server/mods/x.jar` 等效。
  含 `*` `?` `[` 走通配（fnmatch），否则按精确路径或目录前缀（`foo/` 匹配 foo/ 下全部）匹配。
  用途：目录里存在但**永远不该进包**的东西——服务端运行时（world/ logs/ run.sh eula.txt …）。
  命中者：目录扫描/--add-new 时跳过（按规则汇总打印）；已在清单中则被移除（逐条打印 [ignore] 移除）。
  源文件读不到（权限）时跳过并汇总，旧条目保留。

两种模式：
  目录（含 "."）  刷新该前缀下已有条目的哈希；源文件已消失的条目删除。
                  配 --add-new 时，额外把该前缀下 client/ 与 server/ 两侧存在的文件全部纳入清单
                  （同名以 client/ 版为准），命中忽略清单的跳过。注意 "." 会把两侧所有文件
                  都扫一遍，配好 .packignore 再用；全量刷新用不带 --add-new 的 "."。
  单文件          存在源 → 刷新或新增；不存在 → 从清单删除；命中忽略清单 → 跳过。

用法：
    python3 scripts/update-manifest.py .                 # 全量刷新（最常用）
    python3 scripts/update-manifest.py kubejs/ mods/     # 按前缀刷新
    python3 scripts/update-manifest.py --add-new mods/   # 把该前缀下的新文件加入清单（跳过忽略项）
    python3 scripts/update-manifest.py config/xxx.toml   # 单文件增/改/删
    python3 scripts/update-manifest.py --check .         # 只看会改什么，不写盘

注意：含空格的路径要加引号（脚本按参数逐个处理，shell 不会替你合并）。
"""
import fnmatch
import hashlib
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MANIFEST = os.path.join(ROOT, "server-manifest.json")
CLIENT_DIR = "client"
SERVER_DIR = "server"
ROOTS = (CLIENT_DIR, SERVER_DIR)          # 解析顺序：client/ 优先，server/ 兜底
IGNORE_FILE = os.path.join(ROOT, ".packignore")
# 扫描时一律不入清单的名字（非包内容）。注意 FancyMenu 的隐藏布局 dotfile 是合法包内容，不在此列。
SCAN_SKIP_NAMES = (".gitignore", ".packignore")


def sha1(path: str) -> str:
    h = hashlib.sha1()
    with open(path, "rb") as fp:
        for chunk in iter(lambda: fp.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def pack_rel(arg: str) -> str:
    """把命令行给的路径归一成包内相对路径（接受 client/ / server/ / 裸路径三种写法）。"""
    rel = arg.replace("\\", "/")
    while rel.startswith("./"):
        rel = rel[2:]
    for root in ROOTS:
        if rel.startswith(root + "/"):
            rel = rel[len(root) + 1:]
    rel = rel.strip("/")
    return "" if rel == "." else rel


def locate(rel: str):
    """按 client/ → server/ 解析源文件（文件或目录）；两侧都没有返回 None。"""
    for root in ROOTS:
        path = os.path.join(ROOT, root, rel)
        if os.path.exists(path):
            return path
    return None


def is_dir_arg(rel: str) -> bool:
    if rel == "":
        return True
    return any(os.path.isdir(os.path.join(ROOT, root, rel)) for root in ROOTS)


def walk_rel(base: str):
    for r, _dirs, names in os.walk(base):
        for n in names:
            yield os.path.relpath(os.path.join(r, n), base).replace(os.sep, "/")


def read_sha1(path: str):
    """读不到（权限/中途被删）返回 None：由调用处跳过并汇总，不让单个文件中断整轮。"""
    try:
        return sha1(path)
    except OSError:
        return None


def load_ignore() -> list:
    """读 .packignore → 包内相对路径列表（归一后）。文件不存在则空清单。"""
    if not os.path.isfile(IGNORE_FILE):
        return []
    pats = []
    with open(IGNORE_FILE, encoding="utf-8") as fp:
        for line in fp:
            line = line.split("#", 1)[0].strip()
            rel = pack_rel(line) if line else ""
            if rel and rel not in pats:
                pats.append(rel)
    return pats


def match_ignore(rel: str, pats: list):
    """rel 命中忽略清单 → 返回命中的规则串（打印用），否则 None。"""
    if os.path.basename(rel) in SCAN_SKIP_NAMES:
        return os.path.basename(rel)
    for p in pats:
        if any(ch in p for ch in "*?["):
            if fnmatch.fnmatch(rel, p):
                return p
        elif rel == p or rel.startswith(p + "/"):
            return p
    return None


def main() -> int:
    argv = sys.argv[1:]
    check = "--check" in argv
    add_new = "--add-new" in argv
    args = [a for a in argv if not a.startswith("--")]
    if not args:
        print("usage: update-manifest.py [--check] [--add-new] <路径|目录|.> ...", file=sys.stderr)
        return 1

    pats = load_ignore()
    if os.path.isfile(IGNORE_FILE):
        shown = ", ".join(pats) if pats else "（空）"
        print(f"忽略清单 {os.path.relpath(IGNORE_FILE, ROOT)}：{len(pats)} 条 — {shown}")

    with open(MANIFEST, encoding="utf-8") as fp:
        manifest = json.load(fp)
    files = manifest.setdefault("files", [])
    by_path = {e["path"]: e for e in files}
    orig = {e["path"]: e["hash"] for e in files}
    hit = 0                                 # 命中忽略清单的总条数
    unreadable = []                         # (rel, 路径) 读不到的源文件
    rule_hits, rule_sample = {}, {}         # 扫描跳过按规则汇总（含每条前 5 个例子）
    seen_ignored = set()                    # 同一路径两侧各扫一次时只计一次

    for arg in args:
        rel = pack_rel(arg)

        if is_dir_arg(rel):
            prefix = rel + "/" if rel else ""
            targets = [p for p in list(by_path) if p.startswith(prefix)]
            for p in targets:
                rule = match_ignore(p, pats)
                if rule:                         # 清理：已在清单里的忽略项要摘掉
                    files.remove(by_path.pop(p))
                    hit += 1
                    print(f"  [ignore] 移除 {p}（命中 {rule}）")
                    continue
                src = locate(p)
                if src is None:
                    files.remove(by_path.pop(p))
                else:
                    digest = read_sha1(src)
                    if digest is None:
                        unreadable.append((p, src))
                    else:
                        by_path[p]["hash"] = digest
            added = 0
            if add_new:
                found = {}                       # 覆盖层先扫 → 同名以 client/ 版为准
                for root in ROOTS:
                    base = os.path.join(ROOT, root, rel)
                    if not os.path.isdir(base):
                        continue
                    for sub in walk_rel(base):
                        p = prefix + sub
                        if p in by_path or p in found:
                            continue
                        rule = match_ignore(p, pats)
                        if rule:
                            if p in seen_ignored:    # 两侧都有的文件只计一次
                                continue
                            seen_ignored.add(p)
                            hit += 1
                            rule_hits[rule] = rule_hits.get(rule, 0) + 1
                            sample = rule_sample.setdefault(rule, [])
                            if len(sample) < 5:
                                sample.append(p)
                            continue
                        found[p] = os.path.join(base, sub)
                for p in sorted(found):
                    digest = read_sha1(found[p])
                    if digest is None:
                        unreadable.append((p, found[p]))
                        continue
                    files.append({"path": p, "hash": digest})
                    by_path[p] = files[-1]
                    added += 1
            print(f"refreshed {prefix or './'}：{len(targets)} 条"
                  + (f"，新增 {added} 条" if add_new else ""))
            continue

        rule = match_ignore(rel, pats)
        if rule:
            hit += 1
            print(f"skipped {rel}：命中忽略清单 {rule}")
            continue

        src = locate(rel)
        if src and os.path.isfile(src):
            digest = read_sha1(src)
            if digest is None:
                unreadable.append((rel, src))
                continue
            if rel in by_path:
                by_path[rel]["hash"] = digest
            else:
                files.append({"path": rel, "hash": digest})
                by_path[rel] = files[-1]
                print(f"added   {rel}: {digest[:8]}")
        elif rel in by_path:
            files.remove(by_path.pop(rel))
            print(f"removed {rel}（源文件不存在）")
        else:
            print(f"skipped {rel}: 源文件与清单里都没有")

    # 去重（按 path，保留首个）+ 排序
    before = len(files)
    seen, kept = set(), []
    dup = 0
    for e in files:
        if e["path"] in seen:
            dup += 1
            continue
        seen.add(e["path"])
        kept.append(e)
    kept.sort(key=lambda e: e["path"])
    manifest["files"] = kept

    after = {e["path"]: e["hash"] for e in kept}
    if rule_hits:
        print(f"扫描跳过 {sum(rule_hits.values())} 条（命中忽略清单，按规则汇总）：")
        for rule, n in sorted(rule_hits.items(), key=lambda kv: (-kv[1], kv[0])):
            sample = rule_sample[rule]
            detail = "、".join(sample) if n <= 5 else f"例 {sample[0]}"
            print(f"    {rule:<34s}{n:6d}  {detail}")
    if unreadable:
        print(f"\n⚠ 读不到源文件 {len(unreadable)} 个（已跳过；已在清单中的保留旧 hash）：", file=sys.stderr)
        for rel, src in unreadable[:5]:
            print(f"    {rel}  源={os.path.relpath(src, ROOT)}", file=sys.stderr)
        if len(unreadable) > 5:
            print(f"    ... 另有 {len(unreadable) - 5} 个", file=sys.stderr)
    added = sorted(set(after) - set(orig))
    removed = sorted(set(orig) - set(after))
    modified = sorted(p for p in set(orig) & set(after) if orig[p] != after[p])
    for label, paths in (("新增", added), ("删除", removed), ("哈希变更", modified)):
        for p in paths[:10]:
            print(f"  {label}: {p}")
        if len(paths) > 10:
            print(f"  ... 另有 {len(paths) - 10} 条{label}")
    summary = (f"新增 {len(added)} / 删除 {len(removed)} / 哈希变更 {len(modified)} / "
               f"重复 {dup} / 忽略 {hit} / 条目 {before} -> {len(kept)}")

    if check:
        print(f"[--check] 未写入：{summary}")
        return 0

    with open(MANIFEST, "w", encoding="utf-8") as fp:
        json.dump(manifest, fp, ensure_ascii=False, indent=4)
        fp.write("\n")
    print(f"写入 {os.path.relpath(MANIFEST, ROOT)}：{summary}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
