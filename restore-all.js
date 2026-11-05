#!/usr/bin/env node

/**
 * 紧急恢复脚本 - 一键恢复所有核心文件
 * 使用方法：node restore-all.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 开始紧急恢复...\n');

// 创建目录
const dirs = ['src', 'src/components', 'src/hooks'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ 创建目录: ${dir}`);
  }
});

// 文件内容
const files = {
  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,

  'src/index.css': \`@import "tailwindcss";
@import "katex/dist/katex.min.css";

:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --accent: #6366f1;
  --accent-hover: #818cf8;
  --border: #475569;
  --highlight: rgba(99, 102, 241, 0.25);
  --editor-bg: #ffffff;
  --editor-text: #1e293b;
  --editor-text-secondary: #64748b;
  --editor-border: rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 4px;
}

.editor-area {
  background: var(--editor-bg);
}

.editor-textarea {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.7;
  resize: none;
  outline: none;
  background: transparent;
  color: var(--editor-text);
  border: none;
  width: 100%;
  height: 100%;
}

.preview-area {
  background: var(--editor-bg);
}

.preview-content {
  color: var(--editor-text);
  line-height: 1.8;
}

.preview-content h1, .preview-content h2, .preview-content h3,
.preview-content h4, .preview-content h5, .preview-content h6 {
  overflow: visible;
}

.preview-content .katex {
  font-size: 1.2em;
  line-height: 1.8;
}

.preview-content .katex-display {
  margin: 1.5em 0;
  overflow-x: auto;
  padding: 0.8em 0;
}

.sidebar-item {
  padding: 0.6em 0.8em;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sidebar-item:hover {
  background: var(--bg-tertiary);
}

.sidebar-item.active {
  background: var(--highlight);
}

.resize-handle {
  width: 4px;
  cursor: col-resize;
  background: var(--border);
  transition: background 0.2s ease;
}

.resize-handle:hover {
  background: var(--accent);
}

.toast {
  position: fixed;
  bottom: 48px;
  right: 24px;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--accent);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.bottom-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  border: none;
  background: transparent;
  transition: all 0.15s ease;
}

.bottom-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.bottom-btn.active {
  background: var(--highlight);
  color: var(--accent);
}

.luogu-container {
  margin: 1em 0;
  border-radius: 8px;
  border-left: 4px solid;
  overflow: hidden;
}

.luogu-container-title {
  padding: 0.75em 1em;
  font-weight: 600;
  cursor: pointer;
}

.luogu-container-content {
  padding: 1em;
}

details.luogu-container-info {
  border-left-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

details.luogu-container-info > .luogu-container-title {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

details.luogu-container-success {
  border-left-color: #10b981;
  background-color: rgba(16, 185, 129, 0.05);
}

details.luogu-container-success > .luogu-container-title {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

details.luogu-container-warning {
  border-left-color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.05);
}

details.luogu-container-warning > .luogu-container-title {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

details.luogu-container-error {
  border-left-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}

details.luogu-container-error > .luogu-container-title {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
\`,

  'src/hooks/useUndoRedo.ts': \`import { useState, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const set = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prev => {
      const newPresent = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prev.present)
        : newState;
      
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.past.length === 0) return prev;
      
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.future.length === 0) return prev;
      
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  return {
    state: state.present,
    set,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
\`,
};

// 写入文件
console.log('\\n📝 写入核心文件...\\n');

Object.entries(files).forEach(([filePath, content]) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(\`✅ \${filePath}\`);
  } catch (error) {
    console.error(\`❌ 写入失败: \${filePath}\`, error.message);
  }
});

console.log('\\n⚠️  组件文件需要手动恢复');
console.log('\\n💡 建议：');
console.log('   1. 使用 Git 保存代码');
console.log('   2. 或复制代码到本地文件');
console.log('   3. 或上传到 GitHub/GitLab');
console.log('\\n🔗 快速恢复命令：');
console.log('   npm install && npm run build && npm run dev');
