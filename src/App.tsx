import React, { useState, useRef, useCallback, useEffect } from 'react';
import Preview from './components/Preview';
import Sidebar, { Article } from './components/Sidebar';
import ColorPicker from './components/ColorPicker';
import HelpPanel from './components/HelpPanel';
import OutlinePanel from './components/OutlinePanel';
import BookmarkPanel, { BookmarkItem } from './components/BookmarkPanel';
import CommunityPanel from './components/CommunityPanel';
import { useUndoRedo } from './hooks/useUndoRedo';
import { v4 as uuidv4 } from 'uuid';
import { Eye, Edit3, Columns, Save, Download, Undo2, Redo2, Link, Unlink, List, Bookmark, HelpCircle, Palette, Globe, Upload } from 'lucide-react';

const DEFAULT_CONTENT = `# 欢迎使用 MarkTeX Editor 📝

这是一个支持 **Markdown** 和 **LaTeX** 的在线文章编辑器。

## 功能特性

- ✅ Markdown 语法支持
- ✅ LaTeX 数学公式
- ✅ 自定义主题色
- ✅ 文章分类管理
- ✅ 文档大纲导航
- ✅ 滚动同步
- ✅ 书签功能
- ✅ 帮助面板
- ✅ 文章广场
- ✅ 云端同步

## LaTeX 示例

行内公式：$E = mc^2$

块级公式：

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

对齐公式：

$$\\begin{aligned}
f(x) &= x^2 + 2x + 1 \\\\
&= (x + 1)^2
\\end{aligned}$$

分段函数：

$$f(x) = \\begin{cases}
x^2 & \\text{if } x > 0 \\\\
0 & \\text{if } x = 0 \\\\
-x^2 & \\text{if } x < 0
\\end{cases}$$

## 洛谷容器示例

::::info[提示]
这是一个信息框，支持 Markdown 和 LaTeX。

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
::::

::::success[成功]
操作成功完成！
::::

开始编辑吧！ ✨
`;

type ViewMode = 'split' | 'edit' | 'preview';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  likes: number;
}

interface PublishedArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [scrollSync, setScrollSync] = useState(true);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);

  // 面板状态
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // 书签
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('marktex-bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved).map((b: any) => ({ ...b, createdAt: new Date(b.createdAt) }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // 文章广场
  const [publishedArticles, setPublishedArticles] = useState<PublishedArticle[]>(() => {
    const saved = localStorage.getItem('marktex-published-articles');
    if (saved) {
      try {
        return JSON.parse(saved).map((a: any) => ({ 
          ...a, 
          createdAt: new Date(a.createdAt),
          comments: (a.comments || []).map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }))
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const activeArticle = articles.find(a => a.id === activeId);

  useEffect(() => {
    localStorage.setItem('marktex-articles-v2', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('marktex-sidebar-width', String(sidebarWidth));
  }, [sidebarWidth]);

  useEffect(() => {
    localStorage.setItem('marktex-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('marktex-published-articles', JSON.stringify(publishedArticles));
  }, [publishedArticles]);

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

  const handleJumpToLine = useCallback((line: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const lines = textarea.value.split('\n');
    let pos = 0;
    for (let i = 0; i < line - 1 && i < lines.length; i++) {
      pos += lines[i].length + 1;
    }
    textarea.focus();
    textarea.setSelectionRange(pos, pos);
  }, []);

  // 滚动同步
  const handleEditorScroll = useCallback(() => {
    if (!scrollSync || !textareaRef.current || !previewRef.current) return;
    const editor = textareaRef.current;
    const preview = previewRef.current;
    const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
  }, [scrollSync]);

  const handlePreviewScroll = useCallback(() => {
    if (!scrollSync || !textareaRef.current || !previewRef.current) return;
    const editor = textareaRef.current;
    const preview = previewRef.current;
    const percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
  }, [scrollSync]);

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
      category: activeCategory === '全部' ? '草稿' : activeCategory,
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

  const handleSetCategory = (articleId: string, category: string) => {
    setArticles(prev => prev.map(a =>
      a.id === articleId ? { ...a, category, updatedAt: new Date() } : a
    ));
    showToast(`已分类为「${category}」`);
  };

  const handleRenameArticle = () => {
    if (!activeId || !newTitle.trim()) return;
    setArticles(prev => prev.map(a =>
      a.id === activeId ? { ...a, title: newTitle.trim(), updatedAt: new Date() } : a
    ));
    setRenameOpen(false);
    setNewTitle('');
    showToast('文章已重命名');
  };

  const handlePublishArticle = () => {
    if (!activeArticle) return;
    const published: PublishedArticle = {
      id: uuidv4(),
      title: activeArticle.title,
      content: activeArticle.content,
      author: '我',
      likes: 0,
      comments: [],
      createdAt: new Date(),
    };
    setPublishedArticles(prev => [published, ...prev]);
    showToast('文章已发布到广场');
  };

  const handleLikeArticle = (id: string) => {
    setPublishedArticles(prev => prev.map(a => 
      a.id === id ? { ...a, likes: a.likes + 1 } : a
    ));
  };

  const handleAddComment = (articleId: string, content: string) => {
    const comment: Comment = {
      id: uuidv4(),
      author: '我',
      content,
      createdAt: new Date(),
      likes: 0,
    };
    setPublishedArticles(prev => prev.map(a => 
      a.id === articleId ? { ...a, comments: [...a.comments, comment] } : a
    ));
    showToast('评论已发表');
  };

  const handleViewCommunityArticle = (content: string, title: string) => {
    const newArticle: Article = {
      id: uuidv4(),
      title: title,
      content: content,
      category: '笔记',
      updatedAt: new Date(),
    };
    setArticles(prev => [newArticle, ...prev]);
    setActiveId(newArticle.id);
    setCommunityOpen(false);
    showToast('文章已转载到编辑器');
  };

  const handleAddBookmark = (label: string) => {
    if (!activeId) return;
    const bookmark: BookmarkItem = {
      id: uuidv4(),
      articleId: activeId,
      line: cursorLine,
      label,
      createdAt: new Date(),
    };
    setBookmarks(prev => [...prev, bookmark]);
    showToast(`书签已添加到第 ${cursorLine} 行`);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
    showToast('书签已删除');
  };

  const handleJumpToBookmark = (line: number) => {
    handleJumpToLine(line);
    setBookmarkOpen(false);
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
              <span 
                className="text-xs text-[var(--text-secondary)] truncate max-w-[200px] cursor-pointer hover:text-[var(--text-primary)]"
                onClick={() => { setNewTitle(activeArticle.title); setRenameOpen(true); }}
                title="点击重命名"
              >
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

          <div className="relative">
            <button
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
              className={`p-1.5 rounded-md ${colorPickerOpen ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
              title="主题色"
            >
              <Palette className="w-4 h-4" />
            </button>
            <ColorPicker
              open={colorPickerOpen}
              onClose={() => setColorPickerOpen(false)}
            />
          </div>

          <button
            onClick={() => showToast('文章已自动保存 ✓')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium"
          >
            <Save className="w-3.5 h-3.5" />
            <span>保存</span>
          </button>

          <button
            onClick={handlePublishArticle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium"
            title="发布到广场"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>发布</span>
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

      {/* 重命名对话框 */}
      {renameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRenameOpen(false)}>
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 w-[400px]" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold mb-4">重命名文章</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameArticle();
                if (e.key === 'Escape') setRenameOpen(false);
              }}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] mb-4"
              placeholder="输入新标题..."
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRenameOpen(false)}
                className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm hover:bg-[var(--border)]"
              >
                取消
              </button>
              <button
                onClick={handleRenameArticle}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm hover:bg-[var(--accent-hover)]"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {!sidebarCollapsed && (
          <>
            <div style={{ width: `${sidebarWidth}px` }} className="shrink-0">
              <Sidebar
                articles={articles}
                activeId={activeId}
                activeCategory={activeCategory}
                onSelect={setActiveId}
                onNew={handleNewArticle}
                onDelete={handleDeleteArticle}
                onExport={handleExport}
                onCategoryChange={setActiveCategory}
                onSetCategory={handleSetCategory}
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
            <div
              className={`resize-handle ${isResizing ? 'dragging' : ''}`}
              onMouseDown={() => setIsResizing(true)}
            />
          </>
        )}
        {sidebarCollapsed && (
          <Sidebar
            articles={articles}
            activeId={activeId}
            activeCategory={activeCategory}
            onSelect={setActiveId}
            onNew={handleNewArticle}
            onDelete={handleDeleteArticle}
            onExport={handleExport}
            onCategoryChange={setActiveCategory}
            onSetCategory={handleSetCategory}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}

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
                    onScroll={handleEditorScroll}
                    placeholder="在这里开始编写 Markdown 和 LaTeX..."
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                <div 
                  ref={previewRef}
                  className="flex-1 overflow-y-auto preview-area"
                  onScroll={handlePreviewScroll}
                >
                  <Preview content={activeArticle?.content || ''} />
                </div>
              </div>
            )}
          </div>

          {helpOpen && <HelpPanel onClose={() => setHelpOpen(false)} />}
        </div>
      </div>

      <footer className="h-9 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--text-secondary)]">行 {cursorLine}, 列 {cursorCol}</span>
          <span className="text-[11px] text-[var(--text-secondary)]">{lineCount} 行</span>
          <span className="text-[11px] text-[var(--text-secondary)]">{wordCount} 字符</span>

          <div className="h-4 w-px bg-[var(--border)]" />

          <div className="relative">
            <button
              onClick={() => setOutlineOpen(!outlineOpen)}
              className={`bottom-btn ${outlineOpen ? 'active' : ''}`}
              title="文档大纲"
            >
              <List className="w-3 h-3" />
              <span>大纲</span>
            </button>
            {outlineOpen && (
              <OutlinePanel
                content={activeArticle?.content || ''}
                onClose={() => setOutlineOpen(false)}
                onJumpToLine={handleJumpToLine}
              />
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setBookmarkOpen(!bookmarkOpen)}
              className={`bottom-btn ${bookmarkOpen ? 'active' : ''}`}
              title="书签"
            >
              <Bookmark className="w-3 h-3" />
              <span>书签</span>
              {bookmarks.filter(b => b.articleId === activeId).length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[var(--accent)] text-white text-[10px]">
                  {bookmarks.filter(b => b.articleId === activeId).length}
                </span>
              )}
            </button>
            {bookmarkOpen && (
              <BookmarkPanel
                bookmarks={bookmarks.filter(b => b.articleId === activeId)}
                onAdd={handleAddBookmark}
                onRemove={handleRemoveBookmark}
                onJump={handleJumpToBookmark}
                onClose={() => setBookmarkOpen(false)}
              />
            )}
          </div>

          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className={`bottom-btn ${helpOpen ? 'active' : ''}`}
            title="帮助"
          >
            <HelpCircle className="w-3 h-3" />
            <span>帮助</span>
          </button>

          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            className={`bottom-btn ${communityOpen ? 'active' : ''}`}
            title="文章广场"
          >
            <Globe className="w-3 h-3" />
            <span>广场</span>
          </button>

          <button
            onClick={() => setScrollSync(!scrollSync)}
            className={`bottom-btn ${scrollSync ? 'active' : ''}`}
            title={scrollSync ? '关闭滚动同步' : '开启滚动同步'}
          >
            {scrollSync ? <Link className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
            <span>{scrollSync ? '同步' : '不同步'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--text-secondary)]">Markdown + LaTeX</span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            自动保存
          </span>
        </div>
      </footer>

      <CommunityPanel
        open={communityOpen}
        onClose={() => setCommunityOpen(false)}
        onViewArticle={handleViewCommunityArticle}
        publishedArticles={publishedArticles}
        onLikeArticle={handleLikeArticle}
        onAddComment={handleAddComment}
      />

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
