import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import smartgenApi from '../api/smartgen';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = storage.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    smartgenApi
      .getMe()
      .then((data) => setUser(data))
      .catch(() => {
        storage.clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, userData) => {
    storage.setToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    storage.clearToken();
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}