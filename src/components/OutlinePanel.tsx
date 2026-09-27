import { X } from 'lucide-react';

interface OutlinePanelProps {
  content: string;
  onClose: () => void;
  onJumpToLine: (line: number) => void;
}

interface OutlineItem {
  level: number;
  title: string;
  line: number;
}

export default function OutlinePanel({ content, onClose, onJumpToLine }: OutlinePanelProps) {
  const lines = content.split('\n');
  const outline: OutlineItem[] = [];
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      outline.push({
        level: match[1].length,
        title: match[2],
        line: index + 1,
      });
    }
  });

  return (
    <div className="absolute bottom-full mb-2 right-0 panel p-4 slide-up z-50 w-80 max-h-96 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">文档大纲</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-tertiary)]">
          <X className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {outline.length === 0 ? (
          <p className="text-xs text-[var(--text-secondary)] text-center py-4">
            暂无标题，使用 # 创建标题
          </p>
        ) : (
          outline.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onJumpToLine(item.line);
                onClose();
              }}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-[var(--bg-tertiary)] transition-colors group"
              style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--text-secondary)] font-mono">
                  {'#'.repeat(item.level)}
                </span>
                <span className="text-xs text-[var(--text-primary)] truncate flex-1">
                  {item.title}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  L{item.line}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
