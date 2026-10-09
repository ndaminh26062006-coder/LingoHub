import { useState, useEffect } from 'react';
import { commentApi } from '../services/api';
import '../styles/LikeCommentSection.css';

export default function CommentsSection({ commentableType, commentableId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('lh_token');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    loadComments();
  }, [commentableType, commentableId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await commentApi.list(commentableType, commentableId);
      setComments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    try {
      const response = await commentApi.store({
        commentable_type: commentableType,
        commentable_id: commentableId,
        content: newComment
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Lỗi khi gửi bình luận');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Xoá bình luận này?')) return;

    try {
      await commentApi.destroy(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Lỗi khi xoá bình luận');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="comments-section">
      {token && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Chia sẻ ý kiến của bạn..."
            className="comment-input"
            maxLength={500}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#999' }}>
              {newComment.length}/500
            </span>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!newComment.trim() || loading}
            >
              Gửi bình luận
            </button>
          </div>
        </form>
      )}

      <div className="comments-list">
        {loading ? (
          <p>Đang tải bình luận...</p>
        ) : comments.length === 0 ? (
          <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.user?.name || 'Người dùng'}</strong>
                <span className="comment-time">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="comment-content">{comment.content}</p>
              {token && comment.user?.id === parseInt(userId || 0) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  🗑️ Xoá
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
