import { FileText, Plus, Trash2, Tag, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: Date;
}

interface SidebarProps {
  articles: Article[];
  activeId: string | null;
  activeCategory: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
  onCategoryChange: (category: string) => void;
  onSetCategory: (articleId: string, category: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const DEFAULT_CATEGORIES = ['全部', '笔记', '论文', '教程', '草稿', '数学', '编程'];

export default function Sidebar({
  articles,
  activeId,
  activeCategory,
  onSelect,
  onNew,
  onDelete,
  onExport,
  onCategoryChange,
  onSetCategory,
  collapsed,
  onToggle,
}: SidebarProps) {
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('marktex-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('marktex-categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  const filteredArticles = activeCategory === '全部' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  if (collapsed) {
    return (
      <div className="w-12 h-full bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col items-center py-4 gap-3">
        <button onClick={onToggle} className="toolbar-btn" title="展开侧边栏">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
        <button onClick={onNew} className="toolbar-btn" title="新建文章">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col">
      <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-sm font-semibold">文章管理</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onNew} className="toolbar-btn" title="新建文章">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={onToggle} className="toolbar-btn" title="收起侧边栏">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-1 mb-2">
          <Tag className="w-3 h-3 text-[var(--text-secondary)]" />
          <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">分类</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                activeCategory === cat
                  ? 'text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              style={activeCategory === cat ? { background: 'var(--accent)' } : {}}
            >
              {cat}
              <span className="opacity-70">
                {cat === '全部' ? articles.length : articles.filter(a => a.category === cat).length}
              </span>
            </button>
          ))}
          {showNewCategory ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                  if (e.key === 'Escape') {
                    setShowNewCategory(false);
                    setNewCategory('');
                  }
                }}
                onBlur={handleAddCategory}
                placeholder="输入名称"
                className="px-2 py-1 text-xs rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] w-24"
                autoFocus
              />
              <button
                onClick={handleAddCategory}
                className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--accent)]"
                title="确认添加"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={() => { setNewCategory(''); setShowNewCategory(false); }}
                className="p-1 rounded hover:bg-[var(--bg-tertiary)]"
                title="取消"
              >
                <X className="w-3 h-3 text-[var(--text-secondary)]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewCategory(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-all"
              title="添加自定义分类"
            >
              <Plus className="w-3 h-3" />
              <span>新标签</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
            <p>暂无文章</p>
            <p className="text-xs mt-1">点击 + 创建新文章</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className={`sidebar-item group relative ${activeId === article.id ? 'active' : ''}`}
              onClick={() => onSelect(article.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-[var(--text-secondary)] shrink-0" />
                    <p className="text-sm font-medium truncate">
                      {article.title || '无标题'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                      <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {article.category && article.category !== '全部' && (
                      <span className="category-tag">
                        {article.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowCategoryPicker(showCategoryPicker === article.id ? null : article.id); }}
                    className="p-1 rounded hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    title="设置分类"
                  >
                    <Tag className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onExport(article.id); }}
                    className="p-1 rounded hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    title="导出"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(article.id); }}
                    className="p-1 rounded hover:bg-red-900/30 text-[var(--text-secondary)] hover:text-red-400"
                    title="删除"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {showCategoryPicker === article.id && (
                <div className="absolute top-full left-0 mt-1 panel p-2 z-50 w-48 slide-down" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-[var(--text-secondary)]">选择分类</span>
                    <button onClick={() => setShowCategoryPicker(null)} className="p-0.5 rounded hover:bg-[var(--bg-tertiary)]">
                      <X className="w-3 h-3 text-[var(--text-secondary)]" />
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {categories.filter(c => c !== '全部').map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { onSetCategory(article.id, cat); setShowCategoryPicker(null); }}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                          article.category === cat ? 'bg-[var(--highlight)]' : 'hover:bg-[var(--bg-tertiary)]'
                        }`}
                      >
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] flex items-center justify-between">
        <span>共 {filteredArticles.length} 篇{activeCategory !== '全部' ? ` (${activeCategory})` : ''}</span>
        <span>{articles.length} 总计</span>
      </div>
    </div>
  );
}
