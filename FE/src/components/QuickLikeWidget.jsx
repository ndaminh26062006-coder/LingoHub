import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/QuickLikeWidget.css';

/**
 * QuickLikeWidget - Compact like/dislike + view comments button for list cards
 * 
 * Props:
 * - likeableType: 'Document' | 'Exam' | 'EssayQuestion' | 'FlashcardDeck'
 * - likeableId: number
 * - onViewComments: callback to open comments modal
 */
export default function QuickLikeWidget({ likeableType, likeableId, onViewComments }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLike, setUserLike] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const token = localStorage.getItem('lh_token');

  useEffect(() => {
    loadStats();
    loadCommentCount();
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

  const loadCommentCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/comments/${likeableType}/${likeableId}`
      );
      setCommentCount(Array.isArray(response.data) ? response.data.length : 0);
    } catch (err) {
      console.error('Failed to load comment count:', err);
    }
  };

  const handleVote = async (isLiked) => {
    if (!token) {
      alert('Vui lòng đăng nhập');
      return;
    }

    setVoting(true);
    try {
      await axios.post(
        'http://localhost:8000/api/likes',
        {
          likeable_type: likeableType,
          likeable_id: likeableId,
          is_liked: isLiked,
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      await loadStats();
    } catch (err) {
      console.error('Failed to vote:', err);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return <div className="quick-like-widget"></div>;
  }

  return (
    <div className="quick-like-widget">
      <button
        className={`quick-like-btn ${userLike === true ? 'active' : ''}`}
        onClick={() => handleVote(true)}
        disabled={voting}
        title="Thích"
      >
        👍 {likes}
      </button>

      <button
        className={`quick-dislike-btn ${userLike === false ? 'active' : ''}`}
        onClick={() => handleVote(false)}
        disabled={voting}
        title="Không thích"
      >
        👎 {dislikes}
      </button>

      <button
        className="quick-comments-btn"
        onClick={onViewComments}
        title="Xem bình luận"
      >
        💬 Bình luận ({commentCount})
      </button>
    </div>
  );
}
