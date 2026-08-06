// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://stakepro.org",
  //baseURL: "http://hyipbackend.test",
  withCredentials: false,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
        document.cookie = "user_role=; path=/; max-age=0; SameSite=Lax";

        // Redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
