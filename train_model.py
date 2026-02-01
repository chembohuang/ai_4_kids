"""
🎓 训练手写数字识别模型 (PyTorch 版本)
这个脚本会下载 MNIST 数据集并训练一个简单的神经网络

适合给孩子们展示的教育要点：
1. 什么是数据集？ - MNIST 包含 6 万张训练图片和 1 万张测试图片
2. 什么是神经网络？ - 像人脑一样，有很多"神经元"连接在一起
3. 什么是训练？ - 让电脑反复看例子，学会规律
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import os

# 检测设备
device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
print(f"🖥️ 使用设备: {device}")


class DigitNet(nn.Module):
    """
    一个简单的神经网络模型

    📚 给孩子们解释：
    - nn.Linear：全连接层，每个神经元都和前一层的所有神经元相连
    - ReLU：激活函数，让神经网络能学习复杂的东西（把负数变成0）
    - Dropout：防止过拟合（就像学习时不要只死记硬背）
    - 10 个输出：对应数字 0-9
    """
    def __init__(self):
        super(DigitNet, self).__init__()
        # 28x28 = 784 个输入像素
        self.flatten = nn.Flatten()
        self.layers = nn.Sequential(
            nn.Linear(784, 128),    # 第一层：784 -> 128 个神经元
            nn.ReLU(),               # 激活函数
            nn.Dropout(0.2),         # 随机丢弃 20% 的连接
            nn.Linear(128, 64),      # 第二层：128 -> 64 个神经元
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 10)        # 输出层：64 -> 10 个数字
        )

    def forward(self, x):
        x = self.flatten(x)
        return self.layers(x)


def train_and_save_model():
    print("=" * 50)
    print("🎨 MNIST 手写数字识别模型训练 (PyTorch)")
    print("=" * 50)

    # 1. 准备数据转换
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,))  # MNIST 的均值和标准差
    ])

    # 2. 下载 MNIST 数据集
    print("\n📥 正在下载 MNIST 数据集...")
    print("   这个数据集包含很多人手写的数字 0-9")

    data_path = os.path.join(os.path.dirname(__file__), 'data')

    train_dataset = datasets.MNIST(
        root=data_path,
        train=True,
        download=True,
        transform=transform
    )

    test_dataset = datasets.MNIST(
        root=data_path,
        train=False,
        download=True,
        transform=transform
    )

    print(f"\n📊 数据集信息：")
    print(f"   - 训练图片数量：{len(train_dataset)} 张")
    print(f"   - 测试图片数量：{len(test_dataset)} 张")
    print(f"   - 每张图片大小：28 x 28 像素")

    # 3. 创建数据加载器
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=1000, shuffle=False)

    # 4. 创建模型
    print("\n🏗️ 正在创建神经网络模型...")
    model = DigitNet().to(device)

    # 打印模型结构
    print("\n🧠 模型结构：")
    print(model)

    # 定义损失函数和优化器
    criterion = nn.CrossEntropyLoss()  # 交叉熵损失
    optimizer = optim.Adam(model.parameters(), lr=0.001)  # Adam 优化器

    # 5. 训练模型
    print("\n🎯 开始训练模型！")
    print("   模型会看这些图片，学习每个数字长什么样")
    print("   epoch = 训练轮次，每轮都会看一遍所有图片\n")

    epochs = 5
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        correct = 0
        total = 0

        for batch_idx, (data, target) in enumerate(train_loader):
            data, target = data.to(device), target.to(device)

            # 清零梯度
            optimizer.zero_grad()

            # 前向传播
            output = model(data)

            # 计算损失
            loss = criterion(output, target)
            total_loss += loss.item()

            # 反向传播
            loss.backward()

            # 更新参数
            optimizer.step()

            # 统计准确率
            pred = output.argmax(dim=1)
            correct += pred.eq(target).sum().item()
            total += target.size(0)

        # 每轮结束后打印统计信息
        avg_loss = total_loss / len(train_loader)
        accuracy = 100. * correct / total
        print(f"   轮次 {epoch+1}/{epochs}: 损失 = {avg_loss:.4f}, 准确率 = {accuracy:.2f}%")

    # 6. 评估模型
    print("\n📈 测试模型表现...")
    model.eval()
    correct = 0
    total = 0

    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            pred = output.argmax(dim=1)
            correct += pred.eq(target).sum().item()
            total += target.size(0)

    test_accuracy = 100. * correct / total
    print(f"   测试准确率：{test_accuracy:.2f}%")
    print(f"   也就是说，每 100 张图片能认对 {int(test_accuracy)} 张！")

    # 7. 保存模型
    model_path = os.path.join(os.path.dirname(__file__), 'digit_model.pth')
    torch.save({
        'model_state_dict': model.state_dict(),
        'accuracy': test_accuracy
    }, model_path)
    print(f"\n💾 模型已保存至：{model_path}")

    print("\n" + "=" * 50)
    print("✅ 训练完成！现在可以运行 app.py 来测试模型了")
    print("=" * 50)

    return model


if __name__ == "__main__":
    train_and_save_model()
