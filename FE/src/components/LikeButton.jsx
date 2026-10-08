import { useState, useEffect } from 'react';
import { likeApi } from '../services/api';

export default function LikeButton({ likeableType, likeableId, onLiked }) {
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('lh_token');

  useEffect(() => {
    fetchLikes();
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

  const handleLike = async () => {
    if (!token) {
      alert('Vui lòng đăng nhập để like');
      return;
    }

    setLoading(true);
    try {
      if (userLike?.is_liked) {
        await likeApi.destroy(userLike.id);
        setLikes(likes - 1);
        setUserLike(null);
      } else {
        const response = await likeApi.store({
          likeable_type: likeableType,
          likeable_id: likeableId,
          is_liked: true
        });
        if (response.data.voted) {
          setLikes(likes + 1);
          setUserLike({ id: response.data.id, is_liked: true });
        }
      }
      onLiked?.();
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`like-button ${userLike?.is_liked ? 'liked' : ''}`}
      onClick={handleLike}
      disabled={loading || !token}
      title={token ? 'Like' : 'Đăng nhập để like'}
    >
      👍 {likes}
    </button>
  );
}
