import axios from 'axios';

/**
 * Dynamically determine API base URL
 * - On localhost: use http://localhost:3002
 * - On network IP: use same IP with port 3002
 */
const getAPIBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  
  if (envURL) {
    return envURL;
  }

  // If accessing from localhost, use localhost:3002
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3002';
  }

  // If accessing from network IP (e.g., 172.29.8.24), use same IP with port 3002
  return `http://${window.location.hostname}:3002`;
};

const API_BASE_URL = getAPIBaseURL();

console.log('API Base URL:', API_BASE_URL);

/**
 * Axios client for AquaFlow Local API
 * Replaces Base44 SDK with REST API calls
 */
const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Error interceptor
client.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default client;
