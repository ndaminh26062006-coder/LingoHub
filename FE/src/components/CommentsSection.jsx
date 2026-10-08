import { useState, useEffect } from 'react';
import { commentApi } from '../services/api';

export default function CommentsSection({ commentableType, commentableId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('lh_token');

  useEffect(() => {
    loadComments();
  }, [commentableType, commentableId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await commentApi.list(commentableType, commentableId);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to load comments:', err);
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
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentApi.destroy(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="comments-section">
      {token && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Thêm bình luận..."
            className="comment-input"
          />
          <button type="submit" className="btn btn-primary" disabled={!newComment.trim()}>
            Gửi
          </button>
        </form>
      )}

      <div className="comments-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : comments.length === 0 ? (
          <p>Chưa có bình luận nào</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.user?.name}</strong>
                <span className="comment-time">
                  {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="comment-content">{comment.content}</p>
              {token && comment.user?.id === parseInt(localStorage.getItem('user_id') || 0) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="btn btn-outline btn-sm"
                >
                  Xóa
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
