import axios from 'axios';

const api = axios.create({
  // This will use your Vercel URL in production
  // and in development, it will use '/' which respects your package.json 'proxy'
  baseURL: process.env.REACT_APP_API_URL || '/'
});

/* This is an "interceptor". It's a function that will run 
  BEFORE every single request you make using 'api'.
*/
api.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // 2. If the token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Send the request with the new headers
    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  }
);

export default api;
