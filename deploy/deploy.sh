#!/bin/bash
# 部署 AI 数字识别应用到 chembo.top，监听 5000 端口
# 用法: ./deploy/deploy.sh

set -e
REMOTE="root@chembo.top"
APP_DIR="/opt/ai4kids"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> 项目目录: $PROJECT_DIR"
echo "==> 目标: $REMOTE:$APP_DIR"
echo ""

# 1. 同步代码（排除大文件、缓存、用户数据）
echo "==> 同步代码到服务器..."
ssh "$REMOTE" "mkdir -p $APP_DIR"
( cd "$PROJECT_DIR" && tar --exclude='.git' --exclude='__pycache__' --exclude='*.pyc' \
  --exclude='venv' --exclude='data' --exclude='user_training_data' --exclude='mnist_*.png' \
  --exclude='.DS_Store' -cf - . ) | ssh "$REMOTE" "cd $APP_DIR && tar -xf -"

# 2. 在服务器上安装依赖并启动服务
echo ""
echo "==> 在服务器上安装依赖并配置服务..."
ssh "$REMOTE" "cd $APP_DIR && \
  mkdir -p user_training_data data && \
  ( [ -d venv ] || python3 -m venv venv ) && \
  ./venv/bin/pip install -q --no-cache-dir -r requirements.txt && \
  sudo cp deploy/ai4kids.service /etc/systemd/system/ && \
  sudo systemctl daemon-reload && \
  sudo systemctl enable ai4kids && \
  sudo systemctl restart ai4kids && \
  sleep 2 && \
  sudo systemctl status ai4kids --no-pager"

echo ""
echo "==> 部署完成！"
echo "    应用地址: http://chembo.top:5000"
echo "    查看日志: ssh $REMOTE 'journalctl -u ai4kids -f'"
