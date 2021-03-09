import axios from 'axios';
import { BACKEND_API_URI } from '../constants';

const API = axios.create({
  baseURL: BACKEND_API_URI,
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err?.response?.status === 401 &&
      !window.location.href.match(/\/login| \/signup/)
    ) {
      API.post('/auth/logout');
      window.location.href = '/login';
    }
    throw err;
  }
);

export default API;
