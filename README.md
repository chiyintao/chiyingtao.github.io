# 笔记 - 手写风格笔记应用

一个优雅的手写风格笔记应用，支持便签、图片、箭头、文字框等多种装饰组件。

## ✨ 特性

- 📖 多笔记本管理
- 📑 章节和页面管理
- 🎨 手写风格界面
- 📌 便签、箭头、文字框装饰
- 🖼️ 图片上传和管理
- 🔒 隐私模式（模糊旧内容）
- 💾 本地存储（localStorage）
- 📤 导出/导入功能
- 🌓 全屏模式

## 🚀 在线访问

访问地址：`https://chiyintao.github.io/仓库名/`

## 📦 本地运行

1. 克隆仓库
```bash
git clone https://github.com/chiyintao/仓库名.git
cd 仓库名
```

2. 直接打开 `index.html` 或使用本地服务器
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

3. 访问 `http://localhost:8000`

## 📁 项目结构

```
Kimi_Agent_Deployment_v1/
├── index.html                    # 主入口文件
├── little-prince-journal-modular.html  # 应用主文件
├── js/
│   ├── app.js                   # 应用核心逻辑
│   ├── storage.js               # 数据存储模块
│   ├── dragManager.js           # 拖拽管理
│   ├── annotationManager.js     # 组件管理
│   ├── imageUtils.js            # 图片处理
│   └── sampleData.js            # 示例数据
└── 清除旧数据.html              # 数据清理工具
```

## 🎯 使用说明

### 笔记本管理
- 点击左侧笔记本切换
- 点击笔记本名称可编辑
- 右键删除笔记本

### 章节管理
- 点击 ➕ 添加新章节
- 点击章节标题可编辑
- 右键删除章节

### 页面编辑
- 直接在页面上输入文字
- 使用工具栏添加装饰组件
- 拖拽、旋转、调整大小
- 拖到垃圾桶删除组件

### 隐私模式
- 点击眼睛图标开启
- 自动模糊旧内容
- 保持最新3个字清晰

### 数据管理
- 导出：保存所有数据为JSON
- 导入：恢复之前的数据
- 清除：使用清除旧数据工具

## 🛠️ 技术栈

- 纯前端应用（HTML + CSS + JavaScript）
- Tailwind CSS（样式框架）
- localStorage（数据存储）
- 无需后端服务器

## 📝 示例内容

应用预置了两个示例笔记本：
- 📖 小王子
- 🌸 窗边的小豆豆

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

**chiyintao (吃樱桃一辈子)**
- GitHub: [@chiyintao](https://github.com/chiyintao)
- Email: 2767771763@qq.com

---

⭐ 如果这个项目对你有帮助，请给个星标！
