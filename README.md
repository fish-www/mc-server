使用 [MCDReforged](https://github.com/MCDReforged/MCDReforged) 管理 [NeoForge](https://github.com/neoforged/NeoForge) 服务器

使用 [Minecraft-QQBot](https://github.com/Minecraft-QQBot/BotServer) 及其 [mcdr 插件](https://github.com/Minecraft-QQBot/Plugin.McdReforged) 实现 qq bot

## 部署

> 参考 [mcdr 文档](https://docs.mcdreforged.com/zh-cn/latest/quick_start/install.html) 与 [neoforge 文档](https://docs.neoforged.net/user/docs/server)

这里选择使用 [uv](https://github.com/astral-sh/uv) 管理 python 环境，参考 [uv 文档](https://docs.astral.sh/uv/getting-started/installation/) 安装好 uv 之后，克隆此项目，在项目根目录执行下面的命令安装并初始化 mcdr：

```bash
uv sync
uv run mcdreforged init
```

之后安装 neoforge：

```bash
cd server
wget https://maven.neoforged.net/releases/net/neoforged/neoforge/21.1.228/neoforge-21.1.228-installer.jar
java -jar neoforge-21.1.228-installer.jar --installServer
cd ..
```

这里可以选择手动启动服务：

```bash
uv run mcdreforged
```

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