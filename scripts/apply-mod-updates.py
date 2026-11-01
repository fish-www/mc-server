#!/usr/bin/env python3
"""把更新后的客户端 mods 目录同步到本仓的 server/mods 与 client/mods。

本仓的约定：client/mods 只放仅客户端的 mod，server/mods 放服务端的 mod（含两侧共用），
清单生成时同一个包内路径 client/ 优先。所以更新时不能整目录覆盖，要按 mod 拆开：

  - 目标目录里的 mod 在本仓 server/mods 里已有同一个 mod → 换成本次的新版本（放 server/）
  - 在 server/mods 里没有 → 仅客户端（放 client/），除非用 --add-server 指定
  - server/mods 里有、目标目录里没有 → 服务端独有，原样保留
  - --exclude 指定的 → 两侧都不放（例如已经废弃的兼容桥）

同名文件优先按文件名配对，其次按 jar 里的 modId 配对（改名/改大小写也能认出来）。
默认只预演，加 --apply 才写盘；写盘前用硬链接把两个 mods 目录备份到仓根上一级。

用法：
    python3 scripts/apply-mod-updates.py --source ~/.minecraft/versions/aer-temp/mods
    python3 scripts/apply-mod-updates.py --source <dir> --add-server handcrafted --apply
    python3 scripts/apply-mod-updates.py --source <dir> --exclude sereneseasons --apply
    python3 scripts/apply-mod-updates.py --selftest

写完记得同步清单：
    python3 scripts/update-manifest.py .
    python3 scripts/update-manifest.py --add-new mods/
"""
import argparse
import hashlib
import os
import re
import shutil
import sys
import time
from collections import defaultdict
from zipfile import ZipFile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MODS_DIRS = {"server": os.path.join(ROOT, "server", "mods"),
             "client": os.path.join(ROOT, "client", "mods")}
DISABLED_SUFFIXES = (".disabled", ".disable")
MOD_META = ("META-INF/neoforge.mods.toml", "META-INF/mods.toml")
MOD_ID_RE = re.compile(r"""modId\s*=\s*["']([^"']+)["']""")


def base_name(name: str) -> str:
    for suffix in DISABLED_SUFFIXES:
        if name.endswith(suffix):
            return name[: -len(suffix)]
    return name


def read_mod_id(path: str):
    """jar 元数据里的主 modId；读不出来（老格式/没元数据）返回 None。"""
    try:
        with ZipFile(path) as jar:
            names = set(jar.namelist())
            for meta in MOD_META:
                if meta in names:
                    text = jar.read(meta).decode("utf-8", "replace")
                    # [[mods]] 在前，[[dependencies.*]] 在后，只要自己的 id
                    ids = MOD_ID_RE.findall(text.split("[[dependencies")[0])
                    return ids[0].lower() if ids else None
    except Exception:  # 坏 jar：退回按文件名配对
        pass
    return None


def sha1(path: str) -> str:
    h = hashlib.sha1()
    with open(path, "rb") as fp:
        for chunk in iter(lambda: fp.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def collect(directory: str):
    entries = []
    for name in sorted(os.listdir(directory)):
        path = os.path.join(directory, name)
        if os.path.isfile(path):
            entries.append({"name": name, "path": path, "mod_id": read_mod_id(path)})
    return entries


def matches(entry, patterns) -> bool:
    """文件名、去掉 .disabled 的文件名、modId 任一命中即算命中。"""
    keys = {entry["name"], base_name(entry["name"]), entry["mod_id"]}
    return any(p in keys for p in patterns if p)


def build_plan(server, source, add_server=(), exclude=()):
    """返回 (assignments, kept)。

    assignments: [{"dest": server|client|skip, "name", "src", "old_name"|None}]
    kept:        server/mods 里存在但目标目录没有的条目（服务端独有，原样保留）
    """
    srv_by_name = {e["name"]: e for e in server}
    srv_by_id = defaultdict(list)
    for e in server:
        if e["mod_id"]:
            srv_by_id[e["mod_id"]].append(e)

    assignments, used = [], set()
    for entry in source:
        if matches(entry, exclude):
            assignments.append({"dest": "skip", "name": entry["name"],
                                "src": entry["path"], "old_name": None})
            continue
        old = srv_by_name.get(entry["name"])
        if old is None and entry["mod_id"]:
            candidates = [e for e in srv_by_id[entry["mod_id"]] if e["name"] not in used]
            if len(candidates) == 1:          # 多个同 id 的 jar 会有歧义，交给文件名规则
                old = candidates[0]
        if old is not None:
            used.add(old["name"])
        dest = "server" if (old is not None or matches(entry, add_server)) else "client"
        assignments.append({"dest": dest, "name": entry["name"],
                            "src": entry["path"], "old_name": old["name"] if old else None})

    kept = [e for e in server if e["name"] not in used]
    return assignments, kept


def summarize(assignments, kept):
    """把计划分类成 更新/未变/新增/保留/移除，供打印和校验。"""
    result = {dest: {"update": [], "same": [], "add": [], "keep": [], "remove": []}
              for dest in ("server", "client")}
    result["skip"] = []
    for a in assignments:
        if a["dest"] == "skip":
            result["skip"].append(a["name"])
            continue
        bucket = result[a["dest"]]
        current = os.path.join(MODS_DIRS[a["dest"]], a["name"])
        old_name = a["old_name"]
        if old_name is not None:
            old_path = os.path.join(MODS_DIRS["server"], old_name)
            if old_name == a["name"] and os.path.isfile(old_path) \
                    and sha1(old_path) == sha1(a["src"]):
                bucket["same"].append(a["name"])
            else:
                bucket["update"].append(old_name if old_name == a["name"]
                                        else f"{old_name} -> {a['name']}")
        elif os.path.isfile(current):
            bucket["same" if sha1(current) == sha1(a["src"]) else "update"].append(a["name"])
        else:
            bucket["add"].append(a["name"])
    for e in kept:
        result["server"]["keep"].append(e["name"])

    # 移除：当前目录里没被保留的文件，且不是某个已安排 mod 的旧版本（改名/升版）
    for dest in ("server", "client"):
        planned = {a["name"] for a in assignments if a["dest"] == dest}
        if dest == "server":
            planned |= {e["name"] for e in kept}
        planned_ids = {read_mod_id(a["src"]) for a in assignments if a["dest"] == dest}
        planned_ids.discard(None)
        if not os.path.isdir(MODS_DIRS[dest]):
            continue
        for name in sorted(os.listdir(MODS_DIRS[dest])):
            path = os.path.join(MODS_DIRS[dest], name)
            if not os.path.isfile(path) or name in planned:
                continue
            if read_mod_id(path) in planned_ids:
                continue
            result[dest]["remove"].append(name)
    return result


def print_plan(result):
    for dest, label in (("server", "server/mods"), ("client", "client/mods")):
        b = result[dest]
        print(f"{label}: 更新 {len(b['update'])} / 未变 {len(b['same'])} / "
              f"新增 {len(b['add'])} / 保留 {len(b['keep'])} / 移除 {len(b['remove'])}")
        for label_, items in (("更新", b["update"]), ("新增", b["add"]),
                              ("移除", b["remove"]), ("保留(服务端独有)", b["keep"])):
            for name in items[:10]:
                print(f"    {label_}  {name}")
            if len(items) > 10:
                print(f"    ... 另有 {len(items) - 10} 条{label_}")
    if result["skip"]:
        print(f"排除 {len(result['skip'])} 个：")
        for name in result["skip"]:
            print(f"    排除  {name}")


def snapshot(src_dir: str, dst_dir: str) -> int:
    """硬链接备份（同一文件系统，秒级、不占空间）；失败则退回复制。"""
    os.makedirs(dst_dir, exist_ok=True)
    count = 0
    for name in os.listdir(src_dir):
        path = os.path.join(src_dir, name)
        if not os.path.isfile(path):
            continue
        target = os.path.join(dst_dir, name)
        try:
            os.link(path, target)
        except OSError:
            shutil.copy2(path, target)
        count += 1
    return count


def write_dir(directory: str, files: dict) -> None:
    """用 files {文件名: 源路径} 重建目录：先建 .new，再整体替换。"""
    tmp = directory + ".new"
    if os.path.exists(tmp):
        shutil.rmtree(tmp)
    os.makedirs(tmp)
    for name, path in files.items():
        shutil.copy2(path, os.path.join(tmp, name))
    if os.path.isdir(directory):
        shutil.rmtree(directory)
    os.rename(tmp, directory)


def apply_plan(assignments, kept, backup_root: str) -> str:
    stamp = time.strftime("%Y%m%d-%H%M%S")
    backup = os.path.join(backup_root, f"mods-backup-{stamp}")
    for dest in ("server", "client"):
        if os.path.isdir(MODS_DIRS[dest]):
            snapshot(MODS_DIRS[dest], os.path.join(backup, dest))
    for dest in ("server", "client"):
        files = {a["name"]: a["src"] for a in assignments if a["dest"] == dest}
        if dest == "server":
            files.update({e["name"]: e["path"] for e in kept})
        write_dir(MODS_DIRS[dest], files)
    return backup


def selftest() -> int:
    """用假 jar 检查拆分规则。"""
    import tempfile

    def jar(path, mod_id=None):
        if mod_id is None:
            ZipFile(path, "w").writestr("hello.txt", "not a mod")
            return
        toml = '[[mods]]\nmodId="%s"\nversion="1.0"\n' % mod_id
        with ZipFile(path, "w") as z:
            z.writestr("META-INF/neoforge.mods.toml", toml)

    with tempfile.TemporaryDirectory() as tmp:
        server_dir = os.path.join(tmp, "server")
        source_dir = os.path.join(tmp, "source")
        os.makedirs(server_dir)
        os.makedirs(source_dir)
        for name, mod_id in (("foo-1.0.jar", "foo"), ("srvonly-1.0.jar", "srvonly"),
                             ("Renamed-1.0.jar", "renamed"), ("plain.jar", None),
                             ("off-1.0.jar.disabled", "off"), ("stale-1.0.jar", "stale")):
            jar(os.path.join(server_dir, name), mod_id)
        for name, mod_id in (("foo-2.0.jar", "foo"), ("renamed-2.0.jar", "renamed"),
                             ("plain.jar", None), ("off-2.0.jar", "off"),
                             ("clientmod-1.0.jar", "clientmod"), ("newmod-1.0.jar", "newmod"),
                             ("bridge-1.0.jar", "bridge")):
            jar(os.path.join(source_dir, name), mod_id)

        server, source = collect(server_dir), collect(source_dir)
        assignments, kept = build_plan(server, source, add_server=("newmod",),
                                      exclude=("bridge",))
        got = {a["name"]: (a["dest"], a["old_name"]) for a in assignments}
        want = {
            "foo-2.0.jar": ("server", "foo-1.0.jar"),        # 版本更新，未改名
            "renamed-2.0.jar": ("server", "Renamed-1.0.jar"),  # 改大小写，按 modId 认出
            "plain.jar": ("server", "plain.jar"),            # 无元数据，按文件名配对
            "off-2.0.jar": ("server", "off-1.0.jar.disabled"),  # .disabled 也按 modId 换
            "clientmod-1.0.jar": ("client", None),           # 仅客户端
            "newmod-1.0.jar": ("server", None),              # --add-server 强制进服务端
            "bridge-1.0.jar": ("skip", None),                # --exclude
        }
        ok = True
        for name in sorted(set(got) | set(want)):
            if got.get(name) != want.get(name):
                print(f"FAIL {name}: got {got.get(name)}, want {want.get(name)}")
                ok = False
        if [e["name"] for e in kept] != ["srvonly-1.0.jar", "stale-1.0.jar"]:
            print(f"FAIL 服务端独有: {[e['name'] for e in kept]}")
            ok = False
        if not ok:
            return 1

        # 真正的写盘：work/ 下模拟仓根，备份落在同级的 backup/
        work = os.path.join(tmp, "work")
        os.makedirs(os.path.join(work, "server"))
        os.makedirs(os.path.join(work, "client"))
        MODS_DIRS.update({"server": os.path.join(work, "server", "mods"),
                          "client": os.path.join(work, "client", "mods")})
        shutil.copytree(server_dir, MODS_DIRS["server"])
        os.makedirs(MODS_DIRS["client"])
        open(os.path.join(MODS_DIRS["client"], "old-client.jar"), "wb").close()
        backup = apply_plan(assignments, kept, os.path.join(tmp, "backup"))
        got_server = sorted(os.listdir(MODS_DIRS["server"]))
        got_client = sorted(os.listdir(MODS_DIRS["client"]))
        want_server = ["foo-2.0.jar", "newmod-1.0.jar", "off-2.0.jar", "plain.jar",
                       "renamed-2.0.jar", "srvonly-1.0.jar", "stale-1.0.jar"]
        want_client = ["clientmod-1.0.jar"]
        if got_server != want_server or got_client != want_client:
            print(f"FAIL 写盘结果 server={got_server} client={got_client}")
            return 1
        if not os.path.isfile(os.path.join(backup, "server", "foo-1.0.jar")):
            print("FAIL 备份里没有旧文件")
            return 1
    print("selftest ok")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--source", help="更新后的客户端 mods 目录")
    parser.add_argument("--add-server", action="append", default=[], metavar="MOD",
                        help="强制放进服务端的 mod（文件名或 modId，可重复）")
    parser.add_argument("--exclude", action="append", default=[], metavar="MOD",
                        help="两侧都不要的 mod（文件名或 modId，可重复）")
    parser.add_argument("--apply", action="store_true", help="真正写入（默认只预演）")
    parser.add_argument("--selftest", action="store_true", help="用假 jar 检查拆分规则")
    args = parser.parse_args()

    if args.selftest:
        return selftest()
    if not args.source:
        parser.error("--source 必填（或用 --selftest）")
    source_dir = os.path.abspath(os.path.expanduser(args.source))
    if not os.path.isdir(source_dir):
        print(f"error: 源目录不存在: {source_dir}", file=sys.stderr)
        return 1
    if source_dir in [os.path.abspath(d) for d in MODS_DIRS.values()]:
        print("error: --source 不能是本仓的 mods 目录", file=sys.stderr)
        return 1

    source = collect(source_dir)
    if not source:
        print(f"error: 源目录里没有 jar: {source_dir}", file=sys.stderr)
        return 1
    server = collect(MODS_DIRS["server"]) if os.path.isdir(MODS_DIRS["server"]) else []

    assignments, kept = build_plan(server, source, args.add_server, args.exclude)
    result = summarize(assignments, kept)
    print(f"源: {source_dir}（{len(source)} 个文件）\n")
    print_plan(result)

    if not args.apply:
        print("\n预演：未写入。确认后加 --apply")
        return 0

    backup = apply_plan(assignments, kept, os.path.dirname(ROOT))
    print(f"\n已写入。备份: {backup}")
    print("下一步:")
    print("    python3 scripts/update-manifest.py .")
    print("    python3 scripts/update-manifest.py --add-new mods/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
