import axios from "axios";
import { API_URL } from "./config";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
    },
});

// Interceptor tự động thêm token từ localStorage nếu có
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token"); // token từ AuthContext
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
