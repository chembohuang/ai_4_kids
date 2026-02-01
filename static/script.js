/**
 * 🎨 AI 数字识别 - 前端交互脚本
 * 处理画板绑定、图片上传和结果展示
 */

// DOM 元素
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const predictBtn = document.getElementById('predictBtn');
const canvasHint = document.getElementById('canvasHint');
const placeholder = document.getElementById('placeholder');
const result = document.getElementById('result');
const predictedDigit = document.getElementById('predictedDigit');
const confidencePercent = document.getElementById('confidencePercent');
const confidenceFill = document.getElementById('confidenceFill');
const probabilitiesSection = document.getElementById('probabilitiesSection');
const probabilityBars = document.getElementById('probabilityBars');

// 画板状态
let isDrawing = false;
let hasDrawn = false;
let lastX = 0;
let lastY = 0;

// 初始化画板
function initCanvas() {
    // 设置画板背景为白色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置画笔样式
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 18;  // 粗一点的笔触，方便识别
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

// 获取鼠标/触摸位置
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
        return {
            x: (e.touches[0].clientX - rect.left) * scaleX,
            y: (e.touches[0].clientY - rect.top) * scaleY
        };
    }

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

// 开始绘画
function startDrawing(e) {
    isDrawing = true;
    const pos = getPosition(e);
    lastX = pos.x;
    lastY = pos.y;

    // 隐藏提示文字
    if (!hasDrawn) {
        canvasHint.classList.add('hidden');
        hasDrawn = true;
    }

    e.preventDefault();
}

// 绘画中
function draw(e) {
    if (!isDrawing) return;

    const pos = getPosition(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;

    e.preventDefault();
}

// 停止绘画
function stopDrawing() {
    isDrawing = false;
}

// 清除画板
function clearCanvas() {
    initCanvas();
    hasDrawn = false;
    canvasHint.classList.remove('hidden');

    // 隐藏结果
    placeholder.classList.remove('hidden');
    result.classList.add('hidden');
    probabilitiesSection.classList.add('hidden');
}

// 发送预测请求
async function predict() {
    if (!hasDrawn) {
        alert('请先在画板上写一个数字！');
        return;
    }

    // 显示加载状态
    predictBtn.disabled = true;
    predictBtn.innerHTML = '<span class="loading"></span> AI 正在思考...';

    try {
        // 获取画布图片数据
        const imageData = canvas.toDataURL('image/png');

        // 发送请求
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });

        const data = await response.json();

        if (data.success) {
            showResult(data);
        } else {
            alert('识别失败：' + data.error);
        }
    } catch (error) {
        alert('请求失败：' + error.message);
    } finally {
        predictBtn.disabled = false;
        predictBtn.innerHTML = '<span class="btn-icon">🔮</span> 让 AI 来认！';
    }
}

// 显示预测结果
function showResult(data) {
    // 切换显示
    placeholder.classList.add('hidden');
    result.classList.remove('hidden');
    probabilitiesSection.classList.remove('hidden');

    // 显示预测数字
    predictedDigit.textContent = data.digit;

    // 显示置信度
    const confidence = Math.round(data.confidence * 100);
    confidencePercent.textContent = confidence + '%';

    // 动画显示置信度条
    setTimeout(() => {
        confidenceFill.style.width = confidence + '%';
    }, 100);

    // 显示概率分布
    renderProbabilityBars(data.probabilities, data.digit);
}

// 渲染概率分布条形图
function renderProbabilityBars(probabilities, predictedDigit) {
    probabilityBars.innerHTML = '';

    probabilities.forEach((prob, digit) => {
        const percent = Math.round(prob * 100);
        const isHighlight = digit === predictedDigit;

        const item = document.createElement('div');
        item.className = 'probability-item';
        item.innerHTML = `
            <div class="probability-digit ${isHighlight ? 'highlight' : ''}">${digit}</div>
            <div class="probability-bar-vertical">
                <div class="probability-fill-vertical ${isHighlight ? 'highlight' : ''}"
                     style="height: 0%"
                     data-height="${percent}%"></div>
            </div>
            <div class="probability-percent">${percent}%</div>
        `;

        probabilityBars.appendChild(item);
    });

    // 动画显示条形图
    setTimeout(() => {
        document.querySelectorAll('.probability-fill-vertical').forEach(fill => {
            fill.style.height = fill.dataset.height;
        });
    }, 200);
}

// 事件绑定
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// 触摸事件支持
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// 按钮事件
clearBtn.addEventListener('click', clearCanvas);
predictBtn.addEventListener('click', predict);

// 初始化
initCanvas();

console.log('🎨 AI 数字识别器已就绪！');
