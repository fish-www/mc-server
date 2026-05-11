使用 [MCDReforged](https://github.com/MCDReforged/MCDReforged) 管理 [NeoForge](https://github.com/neoforged/NeoForge) 服务器

使用 [Minecraft-QQBot](https://github.com/Minecraft-QQBot/BotServer) 及其 [mcdr 插件](https://github.com/Minecraft-QQBot/Plugin.McdReforged) 实现 qq bot

## 部署

### mcdr

> 参考 [mcdr 文档](https://docs.mcdreforged.com/zh-cn/latest/quick_start/install.html)

这里选择使用 [uv](https://github.com/astral-sh/uv) 管理 python 环境，参考 [uv 文档](https://docs.astral.sh/uv/getting-started/installation/) 安装好 uv 之后，克隆此项目，在项目根目录执行下面的命令安装并初始化 mcdr：

```bash
uv sync
uv run mcdreforged init
```

### neoforge

> 参考 [neoforge 文档](https://docs.neoforged.net/user/docs/server)

执行下面的命令，在 mcdr 的 server 目录中安装 neoforge：

```bash
# 进入 mcdr 的 server 目录
cd server

# 下载 neoforge installer jar
wget https://maven.neoforged.net/releases/net/neoforged/neoforge/21.1.228/neoforge-21.1.228-installer.jar

# 安装
java -jar neoforge-21.1.228-installer.jar --installServer

# neoforge 安装时会覆盖 run.sh 文件，需要 restore 回去
git restore run.sh

# 回到项目根目录
cd ..
```

## 配置

`server/run.sh` 文件中，使用的是 graalvm jdk，可以自行编辑 ，将 `JAVA_BIN` 修改为自己使用的 jdk 路径，如果不打算修改，需要自行下载 [graalvm jdk](https://www.graalvm.org/) 并放在对应位置

`server/user_jvm_args.txt` 中配置了与 graalvm jdk 相配合的一系列 jvm 参数，这里建议按照自己需求进行修改

> 为什么默认配置是这样的？
>
> 我不道啊，当时好像是在 [Cubic Wiki](https://nitwikit.8aka.org/) 上看到 [这里](https://nitwikit.8aka.org/java/advance/optimize/jvm/intro/) 有推荐 graalvm，然后又介绍了一堆 jvm 参数，于是抄了下来，又交给 ai 改了改，跑起来没什么问题，就一直用着了
>
> 总而言之，jdk 的选择和 jvm 的配置，还是自己多实验一下再决定好了

`server/server/properties` 中简单配置了一些东西，比如开启允许飞行，关闭正版验证，并打开了 rcon 功能用于配合 qq bot，这里也可以按照自己的需求修改

`mc.service` 文件是用于 systemd 的 service 文件，里面主要是 `WorkingDirectory` 需要修改成项目路径，如果不打算使用 systemd 的话不需要关心

## 运行

### 手动启动

可以选择手动启动服务：

```bash
uv run mcdreforged
```

### systemd

或者通过 systemd 管理服务

编辑项目根目录下的 `mc.service` 文件，修改 `WorkingDirectory` 的值为项目路径

将 `mc.service` 文件复制到 `~/.config/systemd/user/` 目录下，执行

```bash
# 加载服务
systemctl --user daemon-reload

# 设置服务开机自启，并立即启动服务
systemctl --user enable --now mc
```

之后可以通过 `systemctl` 命令来管理项目：

```bash
# 启动服务
systemctl --user start mc

# 关闭服务
systemctl --user stop mc

# 重启服务
systemctl --user restart mc

# 显示服务状态
systemctl --user status mc

# 重新加载 qq_bot 插件
systemctl --user reload mc
```