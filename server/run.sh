#!/usr/bin/env sh
# Forge requires a configured set of both JVM and program arguments.
# Add custom JVM arguments to the user_jvm_args.txt
# Add custom program arguments {such as nogui} to this file in the next line before the "$@" or
#  pass them to this script directly

# 切换到脚本所在目录
cd "$(dirname "$0")" || exit 1

JAVA_BIN="$HOME/srv/mc/graalvm/bin/java"

# 检查 Java 是否存在
if [ ! -x "$JAVA_BIN" ]; then
    echo "Error: Java not found at $JAVA_BIN"
    exit 1
fi

exec "$JAVA_BIN" @user_jvm_args.txt @libraries/net/neoforged/neoforge/21.1.228/unix_args.txt nogui "$@"
