import axios from 'axios';

const api = axios.create({
  baseURL: 'https://todu.mn/bs/lms/v1', // Swagger дээрх үндсэн хаяг
  headers: {
    'Content-Type': 'application/json',
  },
});

// Хүсэлт явахын өмнө Token автоматаар нэмэх
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

export default api;