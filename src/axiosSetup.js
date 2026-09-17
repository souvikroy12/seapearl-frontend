import axios from 'axios';

// Backend se cookie exchange enable karne ke liye
axios.defaults.withCredentials = true;

// Global Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 aaya aur request pehle retry nahi hui hai
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://seapearl-backend-1.onrender.com';

        // Background mein refresh token endpoint hit karo
        const res = await axios.post(`${backendUrl}/api/auth/refresh`, {}, { withCredentials: true });

        const newToken = res.data.token;

        // LocalStorage mein naya 15m access token save karo
        localStorage.setItem('token', newToken);

        // Failed request ke Authorization header mein naya token attach karo
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // Request retry karo
        return axios(originalRequest);
      } catch (refreshError) {
        // Agar refresh token expired/invalid hai, tabhi logout hoga
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;