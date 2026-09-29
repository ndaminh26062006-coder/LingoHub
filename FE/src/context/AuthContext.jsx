import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Derive initial state from localStorage (persists across page refresh)
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
      avatar: userData.avatar || null,
    };
    localStorage.setItem('lh_user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('lh_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
