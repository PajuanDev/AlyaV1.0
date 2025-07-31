import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = process.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('alyaSession');
    if (stored) {
      const { user: u, token: t } = JSON.parse(stored);
      setUser(u);
      setToken(t);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('alyaSession', JSON.stringify({ user: data.user, token: data.token }));
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) throw new Error('Signup failed');
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('alyaSession', JSON.stringify({ user: data.user, token: data.token }));
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('alyaSession');
  };

  const isOnboardingCompleted = () => {
    return user ? user.onboardingCompleted : false;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, onboardingData, isOnboardingCompleted }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

