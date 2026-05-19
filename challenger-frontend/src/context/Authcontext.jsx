import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('challenger_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (correo, contrasena) => {
    setLoading(true);
    try {
      const res = await api.post('/login', { correo, contrasena });
      localStorage.setItem('challenger_token', res.data.token);
      localStorage.setItem('challenger_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error al iniciar sesión',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (datos) => {
    setLoading(true);
    try {
      const res = await api.post('/register', datos);
      localStorage.setItem('challenger_token', res.data.token);
      localStorage.setItem('challenger_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).flat().join(', ')
        : 'Error al registrarse';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (_) {}
    localStorage.removeItem('challenger_token');
    localStorage.removeItem('challenger_user');
    setUser(null);
  };

  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    localStorage.setItem('challenger_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);