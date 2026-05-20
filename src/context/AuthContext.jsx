import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const res = await axios.post('https://capstone-backend-56wo.onrender.com/common-api/authenticate', { email, password });
      if (res.data.payload) {
        setUser(res.data.payload);
        localStorage.setItem('user', JSON.stringify(res.data.payload));
        return { success: true, user: res.data.payload };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('https://capstone-backend-56wo.onrender.com/common-api/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};
