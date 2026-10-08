import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/LikeButton.css';

/**
 * LikeButton - Like/Dislike button for any item
 * 
 * Props:
 * - likeableType: 'Document' | 'Exam' | 'EssayQuestion' | 'FlashcardDeck'
 * - likeableId: number
 * - onLikesChange: callback when likes/dislikes change (optional)
 */
export default function LikeButton({ likeableType, likeableId, onLikesChange }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLike, setUserLike] = useState(null); // null, true (👍), or false (👎)
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const token = localStorage.getItem('lh_token');

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [likeableType, likeableId]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/likes/stats/${likeableType}/${likeableId}`
      );
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setUserLike(response.data.user_like?.is_liked ?? null);
    } catch (err) {
      console.error('Failed to load likes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (isLiked) => {
    if (!token) {
      alert('Vui lòng đăng nhập để thích/không thích');
      return;
    }

    setVoting(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/likes',
        {
          likeable_type: likeableType,
          likeable_id: likeableId,
          is_liked: isLiked,
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      // Reload stats after vote
      await loadStats();
      onLikesChange?.();
    } catch (err) {
      console.error('Failed to vote:', err);
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể đánh giá'));
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return <div className="like-button-loading"></div>;
  }

  return (
    <div className="like-button">
      {/* Like button */}
      <button
        className={`like-btn ${userLike === true ? 'active' : ''}`}
        onClick={() => handleVote(true)}
        disabled={voting}
        title="Thích"
      >
        👍 <span className="like-count">{likes}</span>
      </button>

      {/* Dislike button */}
      <button
        className={`dislike-btn ${userLike === false ? 'active' : ''}`}
        onClick={() => handleVote(false)}
        disabled={voting}
        title="Không thích"
      >
        👎 <span className="dislike-count">{dislikes}</span>
      </button>
    </div>
  );
}
