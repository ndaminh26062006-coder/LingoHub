import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Handle OAuth callback from backend
 * Backend redirects here with token + user data in URL params
 */
export default function OAuthCallbackHandler() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');
    const error = searchParams.get('oauth_error');

    if (status === 'success' && token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setAuth(user, token);
        // OAuth login always goes to homepage, not dashboard
        navigate('/');
      } catch (e) {
        console.error('Failed to parse user data:', e);
        navigate('/login?error=Invalid response');
      }
    } else if (error) {
      navigate('/login?error=' + encodeURIComponent(error));
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      ⏳ Đang xử lý đăng nhập...
    </div>
  );
}
