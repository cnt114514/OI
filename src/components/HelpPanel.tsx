import { X } from 'lucide-react';

interface HelpPanelProps {
  onClose: () => void;
}

export default function HelpPanel({ onClose }: HelpPanelProps) {
  return (
    <div className="help-panel max-h-[50vh] overflow-y-auto">
      <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] px-4 py-2 flex items-center justify-between z-10">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">语法帮助</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-tertiary)]">
          <X className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="panel">
          <div className="p-3">
            <h4 className="text-sm font-medium mb-2">✏️ 文本格式</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">**粗体**</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">粗体文本</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">*斜体*</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">斜体文本</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">~~删除线~~</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">删除线文本</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">`代码`</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">行内代码</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="p-3">
            <h4 className="text-sm font-medium mb-2">📑 标题</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono"># 一级标题</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">最大的标题</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">## 二级标题</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">次级标题</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">### 三级标题</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">三级标题</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="p-3">
            <h4 className="text-sm font-medium mb-2">∑ LaTeX 基础</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">$E=mc^2$</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">行内公式</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">$$公式$$</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">块级公式</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">\\frac{'{a}'}{'{b}'}</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">分数</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">\\sqrt{'{x}'}</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">平方根</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">\\alpha \\beta</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">希腊字母</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">\\sum_{'{i=1}'}^{'{n}'}</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">求和</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">\\int_{'{a}'}^{'{b}'}</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">积分</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="p-3">
            <h4 className="text-sm font-medium mb-2">📐 LaTeX 环境</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono whitespace-nowrap">\\begin{'{cases}'}</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">分段函数</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono whitespace-nowrap">\\begin{'{aligned}'}</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">对齐公式</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono whitespace-nowrap">\\begin{'{pmatrix}'}</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">圆括号矩阵</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono whitespace-nowrap">\\begin{'{bmatrix}'}</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">方括号矩阵</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="p-3">
            <h4 className="text-sm font-medium mb-2">📦 洛谷容器</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">::::info[标题]</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">信息框（蓝色）</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">::::success[标题]</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">成功框（绿色）</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">::::warning[标题]</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">警告框（黄色）</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">::::error[标题]</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">错误框（红色）</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">:::align{'{center}'}</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">居中对齐</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">:::epigraph[来源]</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">引言框</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="p-3">
            <h4 className="text-sm font-medium mb-2">📋 列表</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">- 项目</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">无序列表</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">1. 项目</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">有序列表</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">- [x] 任务</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">已完成任务</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded text-[var(--accent-hover)] font-mono">- [ ] 任务</code>
                <span className="text-[11px] text-[var(--text-secondary)] pt-0.5">未完成任务</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
