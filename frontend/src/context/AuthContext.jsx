import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch (err) {
          console.error('Failed to validate credentials, logging out.', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      const { access_token } = res.data;
      localStorage.setItem('token', access_token);
      
      const userRes = await authAPI.getMe();
      setUser(userRes.data);
      setLoading(false);
      return userRes.data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (fullName, email, password, role = 'student') => {
    setLoading(true);
    try {
      await authAPI.register({ full_name: fullName, email, password, role });
      
      // Auto login after registration
      const res = await authAPI.login({ email, password });
      const { access_token } = res.data;
      localStorage.setItem('token', access_token);
      
      const userRes = await authAPI.getMe();
      setUser(userRes.data);
      setLoading(false);
      return userRes.data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isStudent,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
