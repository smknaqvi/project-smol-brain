import axios from 'axios';
import { BACKEND_API_URI } from '../constants';

const API = axios.create({
  baseURL: BACKEND_API_URI,
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    throw err;
  }
);

export default API;
