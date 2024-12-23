import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import api from '../api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => void;
  bookAppointment: (appointmentData: { doctorEmail: string; date: string; time: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const signup = async (email: string, password: string, role: User['role']) => {
    const response = await api.post('/signup', { email, password, role });
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const bookAppointment = async (appointmentData: { doctorEmail: string; date: string; time: string }) => {
    await api.post('/appointments', appointmentData);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, bookAppointment }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
