import axios, { AxiosError } from 'axios';
import { Doctor, Appointment } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});


api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LoginResponse {
  user: any;
  token: string;
}

interface ApiError {
  message: string;
}

const handleError = (error: AxiosError<ApiError>) => {
  const message = error.response?.data?.message || 'An error occurred';
  throw new Error(message);
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<LoginResponse>('/login', { email, password });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiError>);
  }
};

export const signup = async (userData: any) => {
  try {
    const response = await api.post<LoginResponse>('/signup', userData);
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiError>);
  }
};

export const getDoctors = async () => {
  try {
    const response = await api.get<Doctor[]>('/doctors');
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiError>);
  }
};

export const createAppointment = async (appointmentData: {
  doctorEmail: string;
  date: string;
  time: string;
}) => {
  try {
    const response = await api.post<Appointment>('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiError>);
  }
};





export const getAppointments = async () => {
  try {
    const response = await api.get<Appointment[]>('/appointments');
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiError>);
  }
};

export default api;