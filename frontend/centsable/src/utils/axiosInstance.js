import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // important for cookie-based auth
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // No need to manually attach Authorization header — tokens are in httpOnly cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor with refresh-token retry logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized — try refreshing token once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/auth/refresh-token");
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Refresh token failed");
        window.location.href = "/login"; // redirect to login
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 500) {
      console.error("Server Error. Please Try Again Later");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
