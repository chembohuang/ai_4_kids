"""
📊 可视化 MNIST 数据集
这个脚本会展示 MNIST 数据集中的一些手写数字样本
"""

import torch
from torchvision import datasets, transforms
import matplotlib.pyplot as plt
import numpy as np
import os

def visualize_mnist():
    print("=" * 50)
    print("📊 MNIST 数据集可视化")
    print("=" * 50)

    # 下载/加载 MNIST 数据集
    data_path = os.path.join(os.path.dirname(__file__), 'data')

    transform = transforms.Compose([transforms.ToTensor()])

    dataset = datasets.MNIST(
        root=data_path,
        train=True,
        download=True,
        transform=transform
    )

    print(f"\n📦 数据集信息:")
    print(f"   总共有 {len(dataset)} 张图片")
    print(f"   每张图片大小: 28 x 28 像素")
    print(f"   数字类别: 0-9 (共10类)")

    # 创建一个 5x10 的网格，展示每个数字的5个样本
    fig, axes = plt.subplots(10, 10, figsize=(12, 14))
    fig.suptitle('MNIST 手写数字数据集样本\n每一行是同一个数字的不同写法',
                 fontsize=16, fontweight='bold', y=0.98)

    # 为每个数字收集样本
    samples_per_digit = {i: [] for i in range(10)}

    for img, label in dataset:
        if len(samples_per_digit[label]) < 10:
            samples_per_digit[label].append(img.numpy().squeeze())

        # 检查是否已经收集够了
        if all(len(v) >= 10 for v in samples_per_digit.values()):
            break

    # 绘制图片
    for digit in range(10):
        for sample_idx in range(10):
            ax = axes[digit, sample_idx]
            ax.imshow(samples_per_digit[digit][sample_idx], cmap='gray')
            ax.axis('off')

            # 在第一列添加数字标签
            if sample_idx == 0:
                ax.set_ylabel(f'数字 {digit}', fontsize=12, rotation=0,
                            labelpad=35, va='center')

    plt.tight_layout()
    plt.subplots_adjust(top=0.92)

    # 保存图片
    output_path = os.path.join(os.path.dirname(__file__), 'mnist_samples.png')
    plt.savefig(output_path, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    print(f"\n💾 图片已保存至: {output_path}")

    # 同时展示数据集中的一些随机样本
    fig2, axes2 = plt.subplots(4, 8, figsize=(14, 8))
    fig2.suptitle('MNIST 数据集随机样本\n（下方数字是正确标签）',
                  fontsize=16, fontweight='bold')

    # 随机选择32个样本
    indices = np.random.choice(len(dataset), 32, replace=False)

    for i, idx in enumerate(indices):
        row = i // 8
        col = i % 8
        img, label = dataset[idx]

        ax = axes2[row, col]
        ax.imshow(img.numpy().squeeze(), cmap='gray')
        ax.set_title(f'{label}', fontsize=14, fontweight='bold', color='blue')
        ax.axis('off')

    plt.tight_layout()

    output_path2 = os.path.join(os.path.dirname(__file__), 'mnist_random_samples.png')
    plt.savefig(output_path2, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    print(f"💾 随机样本图片已保存至: {output_path2}")

    # 显示单个数字的详细信息
    print("\n" + "=" * 50)
    print("📝 单个图片的详细信息:")
    print("=" * 50)

    sample_img, sample_label = dataset[0]
    print(f"   标签 (Label): {sample_label}")
    print(f"   图片形状: {sample_img.shape}")
    print(f"   像素值范围: {sample_img.min():.2f} - {sample_img.max():.2f}")
    print(f"   数据类型: {sample_img.dtype}")

    # 打印一个数字的像素矩阵（ASCII艺术风格）
    print("\n📷 数字 '5' 的像素可视化 (用字符表示亮度):")
    print("-" * 60)

    # 找一个标签为5的图片
    for img, label in dataset:
        if label == 5:
            img_array = img.numpy().squeeze()
            break

    # 将像素值转换为字符
    chars = ' .:-=+*#%@'
    for row in img_array[::2]:  # 每隔一行采样
        line = ''
        for pixel in row:
            char_idx = int(pixel * (len(chars) - 1))
            line += chars[char_idx] * 2  # 每个字符重复两次以保持比例
        print(line)

    print("\n" + "=" * 50)
    print("✅ 可视化完成！请查看生成的图片文件")
    print("=" * 50)

    # 尝试显示图片（如果在图形界面环境中）
    try:
        plt.show()
    except:
        pass

if __name__ == "__main__":
    visualize_mnist()
