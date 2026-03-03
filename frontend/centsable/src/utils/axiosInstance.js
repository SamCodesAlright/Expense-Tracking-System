import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // important for cookie-based auth
  headers: {
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if token exists in localStorage and add to Authorization header
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type for JSON requests (not FormData)
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
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
        const refreshResponse = await axiosInstance.post(
          "/api/v1/auth/refresh-token",
        );
        const newAccessToken = refreshResponse.data.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          axiosInstance.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Refresh token failed");
        // Clear token on refresh failure
        localStorage.removeItem("accessToken");
        delete axiosInstance.defaults.headers.common["Authorization"];
        // avoid kicking user off if already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"; // redirect to login
        }
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
  },
);

export default axiosInstance;
