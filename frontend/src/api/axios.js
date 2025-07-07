// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Automatically attach API key to non-GET requests
api.interceptors.request.use((config) => {
  if (config.method !== 'get') {
    config.headers['x-api-key'] = process.env.REACT_APP_API_KEY;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
