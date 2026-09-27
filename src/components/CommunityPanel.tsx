import { Globe, X, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

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

interface CommunityPanelProps {
  open: boolean;
  onClose: () => void;
  onViewArticle: (content: string, title: string) => void;
  publishedArticles: PublishedArticle[];
  onLikeArticle: (id: string) => void;
  onAddComment: (articleId: string, content: string) => void;
}

export default function CommunityPanel({
  open,
  onClose,
  onViewArticle,
  publishedArticles,
  onLikeArticle,
  onAddComment,
}: CommunityPanelProps) {
  const [selectedArticle, setSelectedArticle] = useState<PublishedArticle | null>(null);
  const [commentText, setCommentText] = useState('');

  if (!open) return null;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins}分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  const handleAddComment = () => {
    if (!selectedArticle || !commentText.trim()) return;
    onAddComment(selectedArticle.id, commentText.trim());
    setCommentText('');
    const updated = publishedArticles.find(a => a.id === selectedArticle.id);
    if (updated) setSelectedArticle(updated);
  };

  if (selectedArticle) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedArticle(null)}>
        <div className="bg-[var(--bg-secondary)] rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedArticle(null)} className="p-1 rounded hover:bg-[var(--bg-tertiary)]">
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
              <div>
                <h2 className="text-lg font-bold">{selectedArticle.title}</h2>
                <p className="text-xs text-[var(--text-secondary)]">{selectedArticle.author} · {formatDate(selectedArticle.createdAt)}</p>
              </div>
            </div>
            <button 
              onClick={() => onViewArticle(selectedArticle.content, selectedArticle.title)}
              className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-hover)]"
            >
              转载到编辑器
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm">{selectedArticle.content}</div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                评论 ({selectedArticle.comments.length})
              </h3>

              <div className="mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的评论..."
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm resize-none focus:outline-none focus:border-[var(--accent)]"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发表评论
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {selectedArticle.comments.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] text-center py-4">暂无评论，快来抢沙发吧！</p>
                ) : (
                  selectedArticle.comments.map((comment) => (
                    <div key={comment.id} className="p-3 rounded-lg bg-[var(--bg-primary)]">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                          {comment.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{comment.author}</span>
                            <span className="text-[10px] text-[var(--text-secondary)]">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-xs text-[var(--text-primary)]">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-[var(--bg-secondary)] rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-lg font-bold">文章广场</h2>
            <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
              {publishedArticles.length} 篇文章
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[var(--bg-tertiary)]">
            <X className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {publishedArticles.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium mb-1">暂无文章</p>
              <p className="text-xs opacity-70">点击右上角"发布"按钮分享你的文章吧！</p>
            </div>
          ) : (
            publishedArticles.map((article) => (
              <div
                key={article.id}
                className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {article.author.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="cursor-pointer"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <h3 className="text-sm font-semibold mb-1">{article.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
                        {article.content.replace(/[#*$`\n]/g, ' ').substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-[var(--text-secondary)]">
                      <span>{article.author}</span>
                      <button 
                        onClick={() => onLikeArticle(article.id)}
                        className="flex items-center gap-1 hover:text-red-400 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                        {article.likes}
                      </button>
                      <button 
                        onClick={() => setSelectedArticle(article)}
                        className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {article.comments.length}
                      </button>
                      <span className="ml-auto">{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-[var(--border)] text-center text-[10px] text-[var(--text-secondary)]">
          文章广场数据保存在本地浏览器
        </div>
      </div>
    </div>
  );
}
