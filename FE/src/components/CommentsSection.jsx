import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CommentsSection.css';

/**
 * CommentsSection - Display and manage comments for any item
 * 
 * Props:
 * - commentableType: 'Document' | 'Exam' | 'EssayQuestion' | 'FlashcardDeck'
 * - commentableId: number
 */
export default function CommentsSection({ commentableType, commentableId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('lh_token');

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [commentableType, commentableId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/comments/${commentableType}/${commentableId}`
      );
      setComments(response.data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('Vui lòng nhập bình luận');
      return;
    }

    if (!token) {
      alert('Vui lòng đăng nhập để bình luận');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/comments',
        {
          commentable_type: commentableType,
          commentable_id: commentableId,
          content: newComment,
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể đăng bình luận'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Xóa bình luận này?')) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/comments/${commentId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể xóa bình luận'));
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">💬 Bình luận ({comments.length})</h3>

      {/* Comment form */}
      <form className="comment-form" onSubmit={handleSubmitComment}>
        <textarea
          className="comment-input"
          placeholder="Chia sẻ ý kiến của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength="5000"
          disabled={!token || submitting}
        />
        <button
          type="submit"
          className="comment-submit"
          disabled={!token || submitting || !newComment.trim()}
        >
          {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
        {!token && <p className="comment-login-hint">Đăng nhập để bình luận</p>}
      </form>

      {/* Comments list */}
      <div className="comments-list">
        {loading ? (
          <p className="comments-loading">Đang tải bình luận...</p>
        ) : comments.length === 0 ? (
          <p className="comments-empty">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.user?.name || 'Ẩn danh'}</span>
                <span className="comment-time">
                  {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                </span>
                {token && comment.user?.id === parseInt(localStorage.getItem('user_id') || '0') && (
                  <button
                    className="comment-delete"
                    onClick={() => handleDeleteComment(comment.id)}
                    title="Xóa bình luận"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
