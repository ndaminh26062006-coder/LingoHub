import { useState, useEffect, useCallback } from 'react';
import { likeApi, commentApi } from '../services/api';
import '../styles/LikeCommentSection.css';

export default function QuickLikeWidget({ likeableType, likeableId, onViewComments }) {
  const [stats, setStats] = useState({ 
    likes: 0, 
    dislikes: 0, 
    userLike: null,
    comments: 0 
  });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const loadStats = useCallback(async () => {
    const tk = localStorage.getItem('lh_token');
    console.log('🔄 loadStats called, token from localStorage:', tk ? `✓ ${tk.substring(0, 20)}...` : '✗ null');
    
    try {
      const [likeRes, commentRes] = await Promise.all([
        likeApi.getStats(likeableType, likeableId),
        commentApi.list(likeableType, likeableId),
      ]);
      
      console.log('📡 API response - user_like:', likeRes.data.user_like);
      
      // Backend returns user_like from DB - trust it
      // Only use localStorage cache if token exists (user is logged in)
      let userLike = likeRes.data.user_like;
      
      if (!userLike && tk) {
        const cacheKey = `like_${likeableType}_${likeableId}`;
        const cached = localStorage.getItem(cacheKey);
        console.log('📦 Checking cache:', cacheKey, '=', cached ? 'exists' : 'null');
        if (cached) {
          try {
            userLike = JSON.parse(cached);
            console.log('📦 Using cached vote:', userLike);
          } catch (e) {
            localStorage.removeItem(cacheKey);
          }
        }
      } else if (!tk) {
        // If not logged in, clear cache to prevent stale votes
        const cacheKey = `like_${likeableType}_${likeableId}`;
        console.log('🔓 Not logged in - clearing cache:', cacheKey);
        localStorage.removeItem(cacheKey);
        userLike = null;
      }
      
      console.log('✅ Final userLike state:', userLike);
      
      setStats({
        likes: likeRes.data.likes || 0,
        dislikes: likeRes.data.dislikes || 0,
        userLike: userLike,
        comments: Array.isArray(commentRes.data) ? commentRes.data.length : 0,
      });
    } catch (err) {
      console.error('❌ Failed to load stats:', err);
    }
  }, [likeableType, likeableId]);

  useEffect(() => {
    // Get token on mount and when it changes
    const tk = localStorage.getItem('lh_token');
    setToken(tk);
  }, [likeableType, likeableId]);

  // Reload stats when token changes (login/logout)
  useEffect(() => {
    loadStats();
  }, [token, likeableType, likeableId, loadStats]);

  const handleReaction = async (isLike) => {
    if (!token) {
      alert('Vui lòng đăng nhập');
      return;
    }
    
    setLoading(true);
    try {
      let response;
      const cacheKey = `like_${likeableType}_${likeableId}`;
      
      // If already voted same type, remove vote
      if (
        (isLike && stats.userLike?.is_liked === true) ||
        (!isLike && stats.userLike?.is_liked === false)
      ) {
        console.log('❌ Removing vote, id:', stats.userLike.id);
        response = await likeApi.destroy(stats.userLike.id);
        localStorage.removeItem(cacheKey);
      } else {
        // Add or change vote
        console.log('✅ Adding vote:', { isLike });
        response = await likeApi.store({
          likeable_type: likeableType,
          likeable_id: likeableId,
          is_liked: isLike,
        });
        // Cache the vote persistently (no expiry)
        if (response.data.user_like) {
          localStorage.setItem(cacheKey, JSON.stringify(response.data.user_like));
        }
      }
      
      // Update state from response stats
      if (response.data.stats) {
        setStats(prev => ({
          ...prev,
          userLike: response.data.user_like || null,
          likes: response.data.stats.likes,
          dislikes: response.data.stats.dislikes,
        }));
        console.log('✅ Stats updated from API:', response.data.stats);
      } else {
        // Fallback: reload from server
        await loadStats();
      }
    } catch (err) {
      console.error('Failed to handle reaction:', err);
      // On error, reload to get fresh state
      await loadStats();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reaction-buttons">
      <button
        className={`btn-reaction ${stats.userLike?.is_liked === true ? 'active' : ''}`}
        onClick={() => {
          console.log('👍 Like CLICKED - token:', token);
          handleReaction(true);
        }}
        disabled={loading || (stats.userLike?.is_liked === false)}
      >
        <span className="icon">👍</span>
        <span className="count">{stats.likes}</span>
      </button>
      <button
        className={`btn-reaction ${stats.userLike?.is_liked === false ? 'active' : ''}`}
        onClick={() => {
          console.log('👎 Dislike CLICKED - token:', token);
          handleReaction(false);
        }}
        disabled={loading || (stats.userLike?.is_liked === true)}
      >
        <span className="icon">👎</span>
        <span className="count">{stats.dislikes}</span>
      </button>
      <button
        className="btn-reaction"
        onClick={onViewComments}
      >
        <span className="icon">💬</span>
        <span className="count">{stats.comments}</span>
      </button>
    </div>
  );
}
