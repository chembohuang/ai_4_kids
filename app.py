"""
🖥️ 手写数字识别 Web 服务 (PyTorch 版本)
这个服务接收用户画的数字图片，然后用训练好的模型来预测

🎓 教学功能：
- 让 AI 故意认错一个数字
- 让小朋友手写正确的数字教 AI
- 快速微调模型
- 验证 AI 学会了
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import transforms, datasets
from torch.utils.data import DataLoader, TensorDataset
import numpy as np
from PIL import Image
import io
import base64
import os
import random
import json
from datetime import datetime

app = Flask(__name__, static_folder='static')
CORS(app)

# 用户训练数据存储路径
USER_DATA_PATH = os.path.join(os.path.dirname(__file__), 'user_training_data')
os.makedirs(USER_DATA_PATH, exist_ok=True)


class DigitNet(nn.Module):
    """和训练时相同的模型结构"""
    def __init__(self):
        super(DigitNet, self).__init__()
        self.flatten = nn.Flatten()
        self.layers = nn.Sequential(
            nn.Linear(784, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 10)
        )

    def forward(self, x):
        x = self.flatten(x)
        return self.layers(x)


# 加载训练好的模型
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'digit_model.pth')
model = None
device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')

# 图像预处理（与训练时相同）
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))
])


def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        print("🧠 正在加载模型...")
        model = DigitNet()
        try:
            checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=True)
        except TypeError:
            checkpoint = torch.load(MODEL_PATH, map_location=device)
        model.load_state_dict(checkpoint['model_state_dict'])
        model.to(device)
        model.eval()
        acc = checkpoint.get('accuracy', 'N/A')
        acc_str = f"{acc:.2f}%" if isinstance(acc, (int, float)) else str(acc)
        print(f"✅ 模型加载成功！(准确率：{acc_str})")
    else:
        print("⚠️ 模型文件不存在，请先运行 train_model.py")


def preprocess_image(image_data):
    """
    预处理用户画的图片
    1. 转换为灰度图
    2. 调整大小为 28x28
    3. 应用与训练相同的归一化
    4. 反转颜色（MNIST 是黑底白字，但画板通常是白底黑字）
    """
    # 从 base64 解码图片
    if ',' in image_data:
        image_data = image_data.split(',')[1]

    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))

    # 转换为灰度图
    image = image.convert('L')

    # 调整大小为 28x28
    image = image.resize((28, 28), Image.Resampling.LANCZOS)

    # 转换为 numpy 数组
    image_array = np.array(image, dtype=np.float32)

    # 反转颜色（画板是白底黑字，MNIST 是黑底白字）
    image_array = 255 - image_array

    # 归一化到 0-1
    image_array = image_array / 255.0

    # 应用 MNIST 的标准化
    image_array = (image_array - 0.1307) / 0.3081

    # 转换为 PyTorch tensor
    image_tensor = torch.from_numpy(image_array).unsqueeze(0).unsqueeze(0)  # (1, 1, 28, 28)

    return image_tensor.to(device)


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/computer-guide')
@app.route('/computer-guide/')
@app.route('/computer-guide/<path:filename>')
def computer_guide(filename='index.html'):
    """给孩子讲解电脑组成的互动指南"""
    return send_from_directory('static/computer-guide', filename)


@app.route('/predict', methods=['POST'])
def predict():
    """
    接收用户画的图片，返回预测结果
    """
    if model is None:
        return jsonify({
            'success': False,
            'error': '模型未加载，请先运行 train_model.py 训练模型'
        })

    try:
        data = request.json
        image_data = data.get('image')

        if not image_data:
            return jsonify({
                'success': False,
                'error': '没有收到图片数据'
            })

        # 预处理图片
        processed_image = preprocess_image(image_data)

        # 模型预测
        with torch.no_grad():
            output = model(processed_image)
            probabilities = torch.softmax(output, dim=1)[0]

        # 获取预测结果
        predicted_digit = int(probabilities.argmax().item())
        confidence = float(probabilities[predicted_digit].item())

        # 返回所有数字的概率（用于可视化）
        all_probabilities = [float(p.item()) for p in probabilities]

        return jsonify({
            'success': True,
            'digit': predicted_digit,
            'confidence': confidence,
            'probabilities': all_probabilities
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })


@app.route('/model-info')
def model_info():
    """返回模型信息"""
    if model is None:
        return jsonify({
            'loaded': False,
            'message': '模型未加载'
        })

    return jsonify({
        'loaded': True,
        'message': '模型已就绪',
        'input_shape': '28 x 28 像素',
        'output': '10 个类别 (数字 0-9)',
        'device': str(device)
    })


# ========================================
# 🎓 教学功能 API
# ========================================

# 存储当前教学会话的 demo 样本
teaching_session = {
    'demo_image': None,
    'demo_label': None,
    'actual_digit': None
}


def get_confusing_sample():
    """
    从 MNIST 数据集中找一个模型容易认错的样本
    这样小朋友可以看到 AI 是如何犯错的
    """
    global teaching_session

    if model is None:
        return None, None, None, None

    # 加载 MNIST 测试集
    data_path = os.path.join(os.path.dirname(__file__), 'data')
    test_dataset = datasets.MNIST(
        root=data_path,
        train=False,
        download=True,
        transform=transforms.ToTensor()
    )

    model.eval()
    confusing_samples = []

    # 寻找模型认错或信心不高的样本
    with torch.no_grad():
        indices = list(range(len(test_dataset)))
        random.shuffle(indices)

        for idx in indices[:500]:  # 只检查前 500 个样本
            image, label = test_dataset[idx]

            # 标准化
            normalized = (image - 0.1307) / 0.3081
            output = model(normalized.unsqueeze(0).to(device))
            probs = torch.softmax(output, dim=1)[0]
            predicted = probs.argmax().item()
            confidence = probs[predicted].item()

            # 找模型认错的，或者信心不高的（<90%）
            if predicted != label or confidence < 0.9:
                confusing_samples.append({
                    'image': image,
                    'label': label,
                    'predicted': predicted,
                    'confidence': confidence,
                    'probs': probs.cpu().numpy()
                })

                if len(confusing_samples) >= 10:
                    break

    if not confusing_samples:
        # 如果没找到认错的，随便选一个
        idx = random.randint(0, len(test_dataset) - 1)
        image, label = test_dataset[idx]
        normalized = (image - 0.1307) / 0.3081
        with torch.no_grad():
            output = model(normalized.unsqueeze(0).to(device))
            probs = torch.softmax(output, dim=1)[0]
            predicted = probs.argmax().item()

        confusing_samples.append({
            'image': image,
            'label': label,
            'predicted': predicted,
            'confidence': probs[predicted].item(),
            'probs': probs.cpu().numpy()
        })

    # 优先选择真正认错的样本
    wrong_samples = [s for s in confusing_samples if s['predicted'] != s['label']]
    sample = random.choice(wrong_samples if wrong_samples else confusing_samples)

    # 将图像转换为 base64
    img_array = (sample['image'].squeeze().numpy() * 255).astype(np.uint8)
    img = Image.fromarray(img_array, mode='L')
    # 放大到更清晰的尺寸
    img = img.resize((140, 140), Image.Resampling.NEAREST)

    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_base64 = base64.b64encode(buffer.getvalue()).decode()

    # 保存到会话中
    teaching_session['demo_image'] = sample['image']
    teaching_session['demo_label'] = sample['label']
    teaching_session['actual_digit'] = sample['label']

    return (
        f"data:image/png;base64,{img_base64}",
        int(sample['label']),
        int(sample['predicted']),
        float(sample['confidence']),
        [float(p) for p in sample['probs']]
    )


@app.route('/get-demo-mistake')
def get_demo_mistake():
    """
    获取一个 AI 容易认错的样本
    用于教学演示：让小朋友看到 AI 也会犯错
    """
    result = get_confusing_sample()

    if result[0] is None:
        return jsonify({
            'success': False,
            'error': '模型未加载'
        })

    image_data, actual_digit, predicted_digit, confidence, probs = result

    return jsonify({
        'success': True,
        'image': image_data,
        'actual_digit': actual_digit,
        'predicted_digit': predicted_digit,
        'is_wrong': actual_digit != predicted_digit,
        'confidence': confidence,
        'probabilities': probs
    })


@app.route('/teach', methods=['POST'])
def teach_ai():
    """
    接收小朋友手写的数字和正确标签
    保存到用户训练数据中
    """
    try:
        data = request.json
        image_data = data.get('image')
        correct_label = data.get('label')

        if image_data is None or correct_label is None:
            return jsonify({
                'success': False,
                'error': '缺少图片或标签'
            })

        # 保存图片
        if ',' in image_data:
            image_data = image_data.split(',')[1]

        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('L')
        image = image.resize((28, 28), Image.Resampling.LANCZOS)

        # 反转颜色（画板是白底黑字，MNIST 是黑底白字）
        image_array = np.array(image, dtype=np.float32)
        image_array = 255 - image_array
        image = Image.fromarray(image_array.astype(np.uint8), mode='L')

        # 保存到文件
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')
        filename = f"digit_{correct_label}_{timestamp}.png"
        filepath = os.path.join(USER_DATA_PATH, filename)
        image.save(filepath)

        # 同时保存标签信息到 JSON
        labels_file = os.path.join(USER_DATA_PATH, 'labels.json')
        labels = {}
        if os.path.exists(labels_file):
            with open(labels_file, 'r') as f:
                labels = json.load(f)

        labels[filename] = {
            'label': int(correct_label),
            'timestamp': timestamp
        }

        with open(labels_file, 'w') as f:
            json.dump(labels, f, indent=2)

        # 统计当前有多少训练数据
        sample_count = len(labels)

        return jsonify({
            'success': True,
            'message': f'已保存！现在有 {sample_count} 个训练样本',
            'sample_count': sample_count,
            'filename': filename
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })


@app.route('/quick-train', methods=['POST'])
def quick_train():
    """
    使用用户提供的数据快速微调模型
    这是一个简化的训练过程，适合教学演示
    """
    global model

    if model is None:
        return jsonify({
            'success': False,
            'error': '模型未加载'
        })

    try:
        # 读取用户训练数据
        labels_file = os.path.join(USER_DATA_PATH, 'labels.json')
        if not os.path.exists(labels_file):
            return jsonify({
                'success': False,
                'error': '没有训练数据，请先教 AI 一些数字'
            })

        with open(labels_file, 'r') as f:
            labels = json.load(f)

        if len(labels) == 0:
            return jsonify({
                'success': False,
                'error': '没有训练数据'
            })

        # 加载用户图片数据
        images = []
        targets = []

        for filename, info in labels.items():
            filepath = os.path.join(USER_DATA_PATH, filename)
            if os.path.exists(filepath):
                img = Image.open(filepath).convert('L')
                img_array = np.array(img, dtype=np.float32) / 255.0
                # 标准化
                img_array = (img_array - 0.1307) / 0.3081
                images.append(img_array)
                targets.append(info['label'])

        if len(images) == 0:
            return jsonify({
                'success': False,
                'error': '无法加载训练图片'
            })

        # 创建数据集
        X = torch.tensor(np.array(images), dtype=torch.float32).unsqueeze(1)
        y = torch.tensor(targets, dtype=torch.long)

        # 为了让训练更有效，重复数据多次
        X = X.repeat(20, 1, 1, 1)  # 重复 20 次
        y = y.repeat(20)

        dataset = TensorDataset(X, y)
        loader = DataLoader(dataset, batch_size=8, shuffle=True)

        # 快速训练
        model.train()
        optimizer = optim.Adam(model.parameters(), lr=0.0005)
        criterion = nn.CrossEntropyLoss()

        total_loss = 0
        for epoch in range(3):  # 只训练 3 轮
            for data, target in loader:
                data, target = data.to(device), target.to(device)
                optimizer.zero_grad()
                output = model(data)
                loss = criterion(output, target)
                loss.backward()
                optimizer.step()
                total_loss += loss.item()

        model.eval()

        # 保存更新后的模型
        torch.save({
            'model_state_dict': model.state_dict(),
            'accuracy': 'fine-tuned',
            'user_samples': len(labels)
        }, MODEL_PATH)

        return jsonify({
            'success': True,
            'message': f'训练完成！使用了 {len(labels)} 个样本',
            'samples_used': len(labels)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })


@app.route('/reset-model', methods=['POST'])
def reset_model():
    """
    重置模型到原始状态（重新训练或加载原始模型）
    """
    global model

    try:
        # 清空用户训练数据
        labels_file = os.path.join(USER_DATA_PATH, 'labels.json')
        if os.path.exists(labels_file):
            with open(labels_file, 'w') as f:
                json.dump({}, f)

        # 清除用户图片
        for f in os.listdir(USER_DATA_PATH):
            if f.endswith('.png'):
                os.remove(os.path.join(USER_DATA_PATH, f))

        # 重新加载原始模型
        load_model()

        return jsonify({
            'success': True,
            'message': '模型已重置'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })


@app.route('/teaching-stats')
def teaching_stats():
    """
    获取教学统计信息
    """
    labels_file = os.path.join(USER_DATA_PATH, 'labels.json')
    sample_count = 0

    if os.path.exists(labels_file):
        with open(labels_file, 'r') as f:
            labels = json.load(f)
            sample_count = len(labels)

    return jsonify({
        'sample_count': sample_count,
        'model_loaded': model is not None
    })


if __name__ == '__main__':
    load_model()
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() in ('1', 'true', 'yes')
    print("\n" + "=" * 50)
    print("🚀 启动手写数字识别服务")
    print("=" * 50)
    print(f"\n🖥️ 使用设备：{device}")
    print(f"\n📱 打开浏览器访问：http://localhost:{port}")
    print("🎨 在画板上写一个数字，看看 AI 能不能认出来！\n")
    app.run(host='0.0.0.0', port=port, debug=debug)
