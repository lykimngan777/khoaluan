import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || '';
const AUTH_API_BASE = `${API_URL}/api/auth`;

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
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn("Lỗi kết nối API Server. Đang chuyển sang chế độ offline/local storage.");
        }
      }

      // Offline/Local Storage Fallback
      const storedUser = localStorage.getItem('careerai_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken('local_token_' + parsedUser.id);
        } catch (e) {
          localStorage.removeItem('careerai_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'Vui lòng nhập đầy đủ email và mật khẩu.' };
    }

    // Try API Login first
    try {
      const res = await fetch(`${AUTH_API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('careerai_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || 'Đăng nhập thất bại.' };
      }
    } catch (error) {
      console.warn("Không thể kết nối API Server. Đăng nhập bằng Local Storage...");
    }

    // Local Storage fallback
    const usersRaw = localStorage.getItem('careerai_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'Email hoặc mật khẩu không chính xác.' };
    }

    const userData = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem('careerai_user', JSON.stringify(userData));
    setUser(userData);
    setToken('local_token_' + found.id);
    return { success: true };
  };

  // Register handler
  const register = async (name, email, password) => {
    if (!name || !email || !password) {
      return { success: false, error: 'Vui lòng nhập đầy đủ thông tin.' };
    }

    // Try API Register first
    try {
      const res = await fetch(`${AUTH_API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('careerai_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || 'Đăng ký thất bại.' };
      }
    } catch (error) {
      console.warn("Không thể kết nối API Server. Đăng ký bằng Local Storage...");
    }

    // Local Storage fallback
    const usersRaw = localStorage.getItem('careerai_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email này đã được sử dụng.' };
    }

    const newUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('careerai_users', JSON.stringify(users));

    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('careerai_user', JSON.stringify(userData));
    setUser(userData);
    setToken('local_token_' + newUser.id);
    return { success: true };
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('careerai_token');
    localStorage.removeItem('careerai_user');
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
