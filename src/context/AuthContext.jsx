import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = [
  { email: 'demo@watchwise.com', password: 'demo123', name: 'Demo User' },
  { email: 'user@test.com', password: 'test123', name: 'Test User' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('watchwise_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState(null);

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { name: found.name, email: found.email };
      setUser(userData);
      localStorage.setItem('watchwise_user', JSON.stringify(userData));
      setError(null);
      return true;
    } else {
      setError('Invalid email or password. Try demo@watchwise.com / demo123');
      return false;
    }
  };

  const signup = (name, email, password) => {
    const exists = MOCK_USERS.find(u => u.email === email);
    if (exists) {
      setError('An account with this email already exists.');
      return false;
    }
    const userData = { name, email };
    setUser(userData);
    localStorage.setItem('watchwise_user', JSON.stringify(userData));
    setError(null);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('watchwise_user');
    localStorage.removeItem('watchwise_watchlist');
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      error,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
