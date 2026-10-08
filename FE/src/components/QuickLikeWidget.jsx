import { useState, useEffect } from 'react';
import { likeApi, commentApi } from '../services/api';

export default function QuickLikeWidget({ likeableType, likeableId, onViewComments }) {
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const token = localStorage.getItem('lh_token');

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [likeableType, likeableId]);

  const fetchLikes = async () => {
    try {
      const response = await likeApi.getStats(likeableType, likeableId);
      setLikes(response.data.likes);
      setUserLike(response.data.user_like);
    } catch (err) {
      console.error('Failed to fetch likes:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentApi.list(likeableType, likeableId);
      setCommentCount(Array.isArray(response.data) ? response.data.length : 0);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleLike = async () => {
    if (!token) {
      alert('Vui lòng đăng nhập để like');
      return;
    }

    try {
      await likeApi.store({
        likeable_type: likeableType,
        likeable_id: likeableId,
        is_liked: true
      });
      onViewComments?.();
      fetchLikes();
    } catch (err) {
      console.error('Failed to like:', err);
    }
  };

  return (
    <div className="quick-like-widget">
      <button 
        className={`like-btn ${userLike?.is_liked ? 'liked' : ''}`}
        onClick={handleLike}
        title="Like"
      >
        👍 {likes}
      </button>
      <button 
        className="comment-btn"
        onClick={onViewComments}
        title="Xem bình luận"
      >
        💬 {commentCount}
      </button>
    </div>
  );
}
