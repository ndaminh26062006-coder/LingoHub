import { createContext, useContext, useState } from 'react';

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

  const login = (userData) => {
    const u = {
      name:   userData.name  || userData.email.split('@')[0],
      email:  userData.email,
      role:   userData.role  || 'student',   // 'admin' | 'student'
      avatar: userData.avatar || null,
    };
    localStorage.setItem('lh_user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('lh_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
