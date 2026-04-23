<<<<<<< HEAD
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://todu.mn/bs/lms/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
=======
export const team3Api = {
  async get(url, options = {}) {
    return { ok: true, url, options, data: null };
  },
  async post(url, body, options = {}) {
    return { ok: true, url, body, options, data: null };
  },
  async put(url, body, options = {}) {
    return { ok: true, url, body, options, data: null };
  },
};

export default team3Api;
>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
