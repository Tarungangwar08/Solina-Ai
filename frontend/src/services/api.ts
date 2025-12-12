import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  googleLogin: (data: { token: string }) => api.post('/auth/google', data),
};

// Chat API
export const chatAPI = {
  sendMessage: (data: { message: string; conversationId?: string }) =>
    api.post('/chat/message', data),
  getConversations: () => api.get('/chat/conversations'),
  getConversation: (id: string) => api.get(`/chat/conversations/${id}`),
  deleteConversation: (id: string) => api.delete(`/chat/conversations/${id}`),
};

// Mood API
export const moodAPI = {
  logMood: (data: { mood: string; moodScore: number; note?: string }) =>
    api.post('/mood/log', data),
  getMoodHistory: (days?: number) =>
    api.get('/mood/history', { params: { days } }),
  getTodayMood: () => api.get('/mood/today'),
};

// Journal API
export const journalAPI = {
  createEntry: (data: { title: string; content: string; mood?: string; tags?: string[] }) =>
    api.post('/journal', data),
  getEntries: (page?: number, limit?: number) =>
    api.get('/journal', { params: { page, limit } }),
  getEntry: (id: string) => api.get(`/journal/${id}`),
  updateEntry: (id: string, data: { title?: string; content?: string; mood?: string; tags?: string[] }) =>
    api.put(`/journal/${id}`, data),
  deleteEntry: (id: string) => api.delete(`/journal/${id}`),
};

// Goals API
export const goalsAPI = {
  createGoal: (data: { title: string; description?: string; category: string; stressLevel?: number; dueDate?: string }) =>
    api.post('/goals', data),
  getGoals: (completed?: boolean) =>
    api.get('/goals', { params: { completed } }),
  updateGoal: (id: string, data: Partial<{ title: string; description: string; category: string; stressLevel: number; progress: number; dueDate: string; completed: boolean }>) =>
    api.put(`/goals/${id}`, data),
  deleteGoal: (id: string) => api.delete(`/goals/${id}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: { name?: string; ageGroup?: string; language?: string; avatar?: string }) =>
    api.put('/user/profile', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/user/password', data),
  deleteAccount: () => api.delete('/user/account'),
};

export default api;