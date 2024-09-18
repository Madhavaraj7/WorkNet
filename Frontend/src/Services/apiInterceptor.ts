import axios from "axios";
import { RefreshTokenAPI } from "./allAPI";

const api = axios.create();

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        try {
          const { accessToken } = await RefreshTokenAPI(refreshToken);
          localStorage.setItem("token", accessToken);

          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest); 
        } catch (err) {
          console.error("Failed to refresh token:", err);
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
