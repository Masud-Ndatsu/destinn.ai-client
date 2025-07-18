// lib/http.ts
import axios, { AxiosError, AxiosInstance } from "axios";

export const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional: include cookies for auth
});

// Optional: intercept request (e.g., add auth token)
http.interceptors.request.use(
  (config) => {
    console.log("🌐 HTTP Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? "[REDACTED]" : undefined
      }
    });
    
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: intercept responses for global error handling
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only handle errors on client side
    if (typeof window !== "undefined") {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401) {
        // Clear token from localStorage
        localStorage.removeItem("token");
        // Redirect to login page or show auth modal
        window.location.href = "/?mode=signin";
      }
      
      // Handle 403 Forbidden - insufficient permissions
      if (error.response?.status === 403) {
        // Log error only on client side and only if console is available
        if (typeof console !== "undefined" && console.error) {
          console.error("Access forbidden: insufficient permissions");
        }
      }
      
      // Handle network errors
      if (!error.response) {
        // Log error only on client side and only if console is available
        if (typeof console !== "undefined" && console.error) {
          console.error("Network error: Please check your connection");
        }
      }
    }
    
    const message = (error.response?.data as any)?.message || error.message;
    return Promise.reject(error);
  }
);
