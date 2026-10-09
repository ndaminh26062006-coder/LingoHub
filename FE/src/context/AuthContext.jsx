import { createContext, useContext, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

function getInitialUser() {
  try {
    const raw = localStorage.getItem('lh_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  // Called after a successful login/register API response
  const setAuth = (userData, token) => {
    localStorage.setItem('lh_token', token);
    localStorage.setItem('lh_user', JSON.stringify(userData));
    setUser(userData);
  };

  // For profile updates without a new token
  const updateUser = (userData) => {
    localStorage.setItem('lh_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('lh_token');
    localStorage.removeItem('lh_user');
    // NOTE: NOT clearing like cache - votes persist across logout/login
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, setAuth, updateUser, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
