# 📦 如何保存你的代码

## ⚠️ 重要提醒

**这个环境的文件每天会自动重置！**

请立即保存你的代码！

---

## 🚀 最简单的保存方法

### 方法 1：使用 Git（推荐）

```bash
# 1. 初始化 Git
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "完整功能版本"

# 4. 创建 GitHub 仓库
# 访问 https://github.com/new
# 仓库名：marktex-editor

# 5. 推送到 GitHub
git remote add origin https://github.com/你的用户名/marktex-editor.git
git branch -M main
git push -u origin main
```

**之后每天：**
```bash
git add .
git commit -m "daily backup"
git push
```

### 方法 2：下载到本地

1. 使用平台的下载功能下载整个项目
2. 保存到本地文件夹
3. 上传到云盘（Google Drive、Dropbox 等）

### 方法 3：复制代码

1. 打开每个文件
2. 复制所有代码
3. 保存到本地文件

---

## 📁 项目文件清单

当前项目包含以下文件：

```
src/
├── App.tsx              ✅ 主应用
├── main.tsx             ✅ 入口文件
├── index.css            ✅ 样式文件
├── components/
│   └── Preview.tsx      ✅ 预览组件
└── hooks/
    └── useUndoRedo.ts   ✅ 撤销重做 Hook
```

---

## 🔧 恢复步骤

如果文件丢失：

```bash
# 1. 从 Git 恢复
git clone https://github.com/你的用户名/marktex-editor.git
cd marktex-editor

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 启动开发
npm run dev
```

---

## 💡 长期建议

### 最佳实践：本地开发

1. **在本地安装开发环境**
   - 安装 Node.js
   - 安装 VS Code
   - 安装 Git

2. **本地开发流程**
   ```bash
   # 克隆项目
   git clone https://github.com/你的用户名/marktex-editor.git
   cd marktex-editor
   
   # 安装依赖
   npm install
   
   # 启动开发
   npm run dev
   ```

3. **日常开发**
   - 在本地编辑代码
   - 使用 Git 提交更改
   - 推送到 GitHub
   - 只在这个环境测试

### 使用在线 IDE

推荐以下平台（代码永久保存）：

- **CodeSandbox** - https://codesandbox.io
- **StackBlitz** - https://stackblitz.com
- **Replit** - https://replit.com

---

## ✅ 立即行动清单

- [ ] 初始化 Git
- [ ] 提交所有代码
- [ ] 创建 GitHub 仓库
- [ ] 推送到 GitHub
- [ ] 设置每日备份提醒

---

## 📞 获取帮助

如果遇到问题：

1. 查看 Git 历史：`git log`
2. 恢复到之前版本：`git checkout .`
3. 从 GitHub 重新克隆

---

**记住：这个环境的文件每天会丢失！**

**立即使用 Git 保存你的代码！** 🚀
