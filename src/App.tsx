import React, { useState, useRef, useCallback, useEffect } from 'react';
import Preview from './components/Preview';
import { useUndoRedo } from './hooks/useUndoRedo';
import { v4 as uuidv4 } from 'uuid';
import { Eye, Edit3, Columns, Save, Download, Undo2, Redo2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: Date;
}

const DEFAULT_CONTENT = `# 欢迎使用 MarkTeX Editor 📝

这是一个支持 **Markdown** 和 **LaTeX** 的在线文章编辑器。

## 功能特性

- ✅ Markdown 语法支持
- ✅ LaTeX 数学公式
- ✅ 自定义主题色
- ✅ 文章分类管理
- ✅ 文档大纲导航
- ✅ 滚动同步

## LaTeX 示例

行内公式：$E = mc^2$

块级公式：

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

对齐公式：

$$\\begin{aligned}
f(x) &= x^2 + 2x + 1 \\\\
&= (x + 1)^2
\\end{aligned}$$

开始编辑吧！ ✨
`;

type ViewMode = 'split' | 'edit' | 'preview';

export default function App() {
  const initialArticles: Article[] = (() => {
    const saved = localStorage.getItem('marktex-articles-v2');
    if (saved) {
      try {
        return JSON.parse(saved).map((a: any) => ({ ...a, updatedAt: new Date(a.updatedAt) }));
      } catch {
        return [];
      }
    }
    return [{
      id: uuidv4(),
      title: '欢迎使用 MarkTeX Editor',
      content: DEFAULT_CONTENT,
      category: '教程',
      updatedAt: new Date(),
    }];
  })();

  const {
    state: articles,
    set: setArticles,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<Article[]>(initialArticles);

  const [activeId, setActiveId] = useState<string | null>(initialArticles[0]?.id || null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [toast, setToast] = useState<string | null>(null);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const activeArticle = articles.find(a => a.id === activeId);

  useEffect(() => {
    localStorage.setItem('marktex-articles-v2', JSON.stringify(articles));
  }, [articles]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const updateContent = useCallback((content: string) => {
    if (!activeId) return;
    setArticles(prev => prev.map(a => {
      if (a.id !== activeId) return a;
      const firstLine = content.split('\n').find(l => l.trim()) || '';
      const title = firstLine.replace(/^#+\s*/, '').trim() || '无标题';
      return { ...a, content, title, updatedAt: new Date() };
    }));
  }, [activeId, setArticles]);

  const handleCursorChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, pos);
    const lines = textBefore.split('\n');
    setCursorLine(lines.length);
    setCursorCol(lines[lines.length - 1].length + 1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        showToast('已撤销');
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
        showToast('已重做');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleNewArticle = () => {
    const newArticle: Article = {
      id: uuidv4(),
      title: '新文章',
      content: '# 新文章\n\n开始编写...\n',
      category: '草稿',
      updatedAt: new Date(),
    };
    setArticles(prev => [newArticle, ...prev]);
    setActiveId(newArticle.id);
    showToast('已创建新文章');
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    if (activeId === id) {
      const remaining = articles.filter(a => a.id !== id);
      setActiveId(remaining[0]?.id || null);
    }
    showToast('文章已删除');
  };

  const handleExport = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    const blob = new Blob([article.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title || 'article'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('文章已导出');
  };

  const wordCount = activeArticle?.content?.length || 0;
  const lineCount = activeArticle?.content?.split('\n').length || 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="h-12 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <h1 className="text-sm font-bold text-[var(--text-primary)]">MarkTeX Editor</h1>
          </div>
          {activeArticle && (
            <>
              <div className="h-5 w-px bg-[var(--border)]" />
              <span className="text-xs text-[var(--text-secondary)] truncate max-w-[200px]">
                {activeArticle.title}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => { undo(); showToast('已撤销'); }}
              disabled={!canUndo}
              className={`p-1.5 rounded-md ${canUndo ? 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]' : 'opacity-30 cursor-not-allowed'}`}
              title="撤销 (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { redo(); showToast('已重做'); }}
              disabled={!canRedo}
              className={`p-1.5 rounded-md ${canRedo ? 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]' : 'opacity-30 cursor-not-allowed'}`}
              title="重做 (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-[var(--border)]" />

          <div className="flex items-center bg-[var(--bg-primary)] rounded-lg p-0.5">
            <button
              className={`p-1.5 rounded-md ${viewMode === 'edit' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)]'}`}
              onClick={() => setViewMode('edit')}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              className={`p-1.5 rounded-md ${viewMode === 'split' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)]'}`}
              onClick={() => setViewMode('split')}
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              className={`p-1.5 rounded-md ${viewMode === 'preview' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)]'}`}
              onClick={() => setViewMode('preview')}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => showToast('文章已自动保存 ✓')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium"
          >
            <Save className="w-3.5 h-3.5" />
            <span>保存</span>
          </button>

          <button
            onClick={() => activeId && handleExport(activeId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-primary)] text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 侧边栏 */}
        <div className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col">
          <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-sm font-semibold">文章列表</span>
            <button onClick={handleNewArticle} className="p-1 rounded hover:bg-[var(--bg-tertiary)]">
              <span className="text-xs">+ 新建</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {articles.map((article) => (
              <div
                key={article.id}
                className={`p-2 rounded cursor-pointer hover:bg-[var(--bg-tertiary)] ${activeId === article.id ? 'bg-[var(--highlight)]' : ''}`}
                onClick={() => setActiveId(article.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate flex-1">{article.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteArticle(article.id); }}
                    className="p-1 rounded hover:bg-red-900/30 text-red-400 opacity-0 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-1">
                  {new Date(article.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 编辑区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2 border-r border-[var(--border)]' : 'w-full'}`}>
                <div className="flex-1 overflow-hidden editor-area">
                  <textarea
                    ref={textareaRef}
                    className="editor-textarea w-full h-full p-6"
                    value={activeArticle?.content || ''}
                    onChange={(e) => { updateContent(e.target.value); handleCursorChange(); }}
                    onClick={handleCursorChange}
                    onKeyUp={handleCursorChange}
                    placeholder="在这里开始编写 Markdown 和 LaTeX..."
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                <div ref={previewRef} className="flex-1 overflow-y-auto preview-area">
                  <Preview content={activeArticle?.content || ''} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="h-9 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--text-secondary)]">行 {cursorLine}, 列 {cursorCol}</span>
          <span className="text-[11px] text-[var(--text-secondary)]">{lineCount} 行</span>
          <span className="text-[11px] text-[var(--text-secondary)]">{wordCount} 字符</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--text-secondary)]">Markdown + LaTeX</span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            自动保存
          </span>
        </div>
      </footer>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
