# 🧠 AI 数字识别 - 儿童 AI 教育项目

这是一个面向 8-12 岁儿童的 AI 入门教育项目，通过手写数字识别帮助孩子们理解机器学习的基本概念。

## 🎯 项目目标

1. 让孩子们亲身体验 AI 的能力
2. 通过简单的例子解释机器学习原理
3. 激发孩子们对 AI 和编程的兴趣

## 🚀 快速开始

### 1. 安装依赖

```bash
cd /Users/chembo.huang/studio/ai_4_kids
pip install -r requirements.txt
```

### 2. 训练模型

第一次使用需要训练模型（约 1-2 分钟）：

```bash
python train_model.py
```

训练过程会：
- 自动下载 MNIST 数据集（60,000 张训练图片）
- 创建并训练神经网络
- 保存训练好的模型

### 3. 启动应用

```bash
python app.py
```

然后打开浏览器访问：**http://localhost:5000**（可通过环境变量 `PORT` 修改端口）

## 📚 教学内容

### 核心概念

1. **数据集 (Dataset)**
   - MNIST 数据集包含很多人手写的数字图片
   - 就像学习认字需要看很多字一样，机器也需要看很多例子

2. **训练 (Training)**
   - 机器反复看例子，找出规律
   - 每次猜错了就调整自己

3. **神经网络 (Neural Network)**
   - 模仿人脑的工作方式
   - 有很多"神经元"互相连接

4. **预测 (Prediction)**
   - 用学到的规律来猜测新的图片

### 教学建议

1. 先让孩子们自己画数字，看 AI 能不能认出来
2. 故意画一些奇怪的数字，看 AI 会怎么反应
3. 讨论：AI 什么时候会犯错？为什么？
4. 展示训练过程的日志，解释"准确率"的含义

## 🗂️ 项目结构

```
ai_4_kids/
├── README.md           # 项目说明
├── requirements.txt    # Python 依赖
├── train_model.py      # 模型训练脚本（带教育注释）
├── app.py              # Flask 后端服务
├── digit_model.pth     # 训练好的模型（训练后生成）
├── deploy/             # 部署脚本
│   ├── deploy.sh      # 一键部署到服务器
│   └── ai4kids.service # systemd 服务配置
└── static/
    ├── index.html      # 网页界面
    ├── styles.css      # 样式文件
    └── script.js       # 前端交互逻辑
```

## 🎨 界面预览

- 🖌️ 画板：孩子们可以用鼠标或触屏画数字
- 🔮 预测：AI 会显示它认为这是什么数字
- 📊 概率：显示每个数字的可能性
- 📚 教育：解释机器学习的基本原理

## 🌐 部署到 chembo.top（端口 5000）

已配置部署到 **chembo.top** 并监听 **5000** 端口。确保本机可 SSH 登录 `root@chembo.top`。

**一键部署：**

```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

部署脚本会：
- 使用 rsync 同步代码到服务器 `/opt/ai4kids`
- 在服务器上创建 Python 虚拟环境并安装依赖
- 安装并启用 systemd 服务，开机自启
- 应用监听 `0.0.0.0:5000`

**访问地址：** http://chembo.top:5000

**常用命令：**
- 查看服务状态：`ssh root@chembo.top 'systemctl status ai4kids'`
- 查看日志：`ssh root@chembo.top 'journalctl -u ai4kids -f'`
- 重启服务：`ssh root@chembo.top 'systemctl restart ai4kids'`

**注意：**
- 服务器需已安装 Python 3。首次使用「看 AI 犯错」功能时，服务会自动下载 MNIST 数据。
- 若部署时 `pip install` 被 kill（内存不足），可在服务器上增加 swap 后重试，或手动安装 CPU 版 PyTorch：`pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu`，再安装其余依赖。

## ⚙️ 技术栈

- **后端**: Python + Flask
- **模型**: PyTorch
- **数据集**: MNIST
- **前端**: HTML + CSS + JavaScript

## 🤔 常见问题

**Q: 为什么 AI 有时候会认错？**
A: 就像人也会认错字一样，AI 也不是完美的。如果写得太潦草或太奇怪，AI 可能会搞混。

**Q: AI 是怎么"学会"认数字的？**
A: AI 看了很多手写数字的例子，记住了每个数字的特点。比如 "8" 有两个圈，"1" 是一条线。

**Q: 可以教 AI 认识更多东西吗？**
A: 当然可以！只要有足够的例子，AI 可以学会认识任何东西。

---

Made with ❤️ for young AI explorers 🚀
