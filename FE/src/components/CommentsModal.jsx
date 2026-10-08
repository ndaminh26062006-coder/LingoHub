import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CommentsModal.css';

/**
 * CommentsModal - Modal dialog to view and add comments
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: callback to close modal
 * - commentableType: 'Document' | 'Exam' | 'EssayQuestion' | 'FlashcardDeck'
 * - commentableId: number
 * - title: optional title for the modal
 */
export default function CommentsModal({ isOpen, onClose, commentableType, commentableId, title }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const token = localStorage.getItem('lh_token');
  const userId = token ? parseInt(localStorage.getItem('user_id') || '0') : 0;

  useEffect(() => {
    if (isOpen) {
      loadComments();
      setCurrentPage(1);
    }
  }, [isOpen, commentableType, commentableId]);

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

  // Pagination logic
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const startIdx = (currentPage - 1) * commentsPerPage;
  const endIdx = startIdx + commentsPerPage;
  const paginatedComments = comments.slice(startIdx, endIdx);

  if (!isOpen) return null;

  return (
    <div className="comments-modal-overlay" onClick={onClose}>
      <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="comments-modal__header">
          <h2 className="comments-modal__title">
            💬 {title ? `Bình luận - ${title}` : 'Bình luận'}
          </h2>
          <button 
            className="comments-modal__close" 
            onClick={onClose}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="comments-modal__body">
          {/* Comment form */}
          <form className="comments-modal__form" onSubmit={handleSubmitComment}>
            <textarea
              className="comments-modal__input"
              placeholder="Chia sẻ ý kiến của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength="5000"
              disabled={!token || submitting}
              rows="3"
            />
            <div className="comments-modal__form-footer">
              <button
                type="submit"
                className="comments-modal__submit"
                disabled={!token || submitting || !newComment.trim()}
              >
                {submitting ? 'Đang gửi...' : 'Gửi'}
              </button>
              {!token && <p className="comments-modal__login-hint">Đăng nhập để bình luận</p>}
            </div>
          </form>

          {/* Comments list */}
          <div className="comments-modal__list">
            {loading ? (
              <p className="comments-modal__empty">Đang tải bình luận...</p>
            ) : comments.length === 0 ? (
              <p className="comments-modal__empty">Chưa có bình luận nào.</p>
            ) : (
              <>
                {paginatedComments.map((comment) => (
                  <div key={comment.id} className="comments-modal__item">
                    <div className="comments-modal__item-header">
                      <span className="comments-modal__author">{comment.user?.name || 'Ẩn danh'}</span>
                      <span className="comments-modal__time">
                        {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                      </span>
                      {token && comment.user?.id === userId && (
                        <button
                          className="comments-modal__delete"
                          onClick={() => handleDeleteComment(comment.id)}
                          title="Xóa"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <p className="comments-modal__content">{comment.content}</p>
                  </div>
                ))}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="comments-modal__pagination">
                    <button
                      className="comments-modal__page-btn"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Trang trước
                    </button>
                    <span className="comments-modal__page-info">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <button
                      className="comments-modal__page-btn"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Trang sau →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
