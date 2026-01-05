import axios from 'axios';
import Cookies from 'js-cookie';
import NProgress from 'nprogress';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL + '/v1' || 'http://localhost:3001/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? Cookies.get('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  NProgress.start();

  return config;
});

api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default api;
