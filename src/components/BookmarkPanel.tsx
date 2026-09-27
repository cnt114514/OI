import { Bookmark, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export interface BookmarkItem {
  id: string;
  articleId: string;
  line: number;
  label: string;
  createdAt: Date;
}

interface BookmarkPanelProps {
  bookmarks: BookmarkItem[];
  onAdd: (label: string) => void;
  onRemove: (id: string) => void;
  onJump: (line: number) => void;
  onClose: () => void;
}

export default function BookmarkPanel({ bookmarks, onAdd, onRemove, onJump, onClose }: BookmarkPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (newLabel.trim()) {
      onAdd(newLabel.trim());
      setNewLabel('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="absolute bottom-full mb-2 right-0 panel p-4 slide-up z-50 w-80 max-h-96 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">书签</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-tertiary)]">
          <X className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      </div>

      {showAddForm ? (
        <div className="mb-3 space-y-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') {
                setShowAddForm(false);
                setNewLabel('');
              }
            }}
            placeholder="书签名称"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-hover)]"
            >
              添加
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewLabel('');
              }}
              className="flex-1 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-medium hover:bg-[var(--border)]"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-3 w-full py-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--text-secondary)] text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" />
          添加书签
        </button>
      )}

      <div className="flex-1 overflow-y-auto space-y-1">
        {bookmarks.length === 0 ? (
          <p className="text-xs text-[var(--text-secondary)] text-center py-4">
            暂无书签
          </p>
        ) : (
          bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] group cursor-pointer transition-colors"
              onClick={() => {
                onJump(bookmark.line);
                onClose();
              }}
            >
              <Bookmark className="w-3 h-3 text-[var(--bookmark-color)]" fill="currentColor" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                  {bookmark.label}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  第 {bookmark.line} 行
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(bookmark.id);
                }}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-900/30 text-[var(--text-secondary)] hover:text-red-400 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
