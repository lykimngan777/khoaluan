import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();
const AUTH_API_BASE = '/api/auth';


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored token and verify user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('careerai_token');
      if (storedToken) {
        try {
          const res = await fetch(`${AUTH_API_BASE}/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setToken(storedToken);
          } else {
            // Token expired or invalid
            localStorage.removeItem('careerai_token');
          }
        } catch (error) {
          console.error("Lỗi xác thực token tự động:", error);
          // If server is offline, we can keep the local token or clear depending on preference. 
          // For prototype, let's keep it if we want to simulate or clear it. Let's clear to be safe.
          localStorage.removeItem('careerai_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch(`${AUTH_API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Đăng nhập thất bại.' };
      }

      localStorage.setItem('careerai_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${AUTH_API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Đăng ký thất bại.' };
      }

      localStorage.setItem('careerai_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('careerai_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
