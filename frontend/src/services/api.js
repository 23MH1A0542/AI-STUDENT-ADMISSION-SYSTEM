import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const coursesAPI = {
  list: (params) => api.get('/courses/', { params }),
  get: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses/', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const applicationsAPI = {
  submit: (data) => api.post('/applications/', data),
  list: (statusFilter) => api.get('/applications/', { params: { status_filter: statusFilter } }),
  get: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, statusData) => api.put(`/applications/${id}/status`, statusData),
  uploadDocument: (id, fileType, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/applications/${id}/upload?file_type=${fileType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const aiAPI = {
  chat: (message) => api.post('/ai/chat', { message }),
  recommendations: (data) => api.post('/ai/recommendations', data),
};

export const analyticsAPI = {
  getStats: () => api.get('/analytics/stats'),
  getStatusChart: () => api.get('/analytics/charts/status'),
  getDeptChart: () => api.get('/analytics/charts/department'),
};

export default api;
