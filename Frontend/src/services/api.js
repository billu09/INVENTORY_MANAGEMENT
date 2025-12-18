import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5050/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // JWT via Authorization header
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    // ✅ Skip token ONLY for auth endpoints
    const isAuthEndpoint =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register");

    if (!isAuthEndpoint) {
      const raw = localStorage.getItem("user");

      if (raw) {
        try {
          const user = JSON.parse(raw);
          if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch {
          localStorage.removeItem("user");
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    // 🚫 Ignore OPTIONS & auth endpoints
    if (
      error.config?.method === "options" ||
      error.config?.url?.includes("/auth")
    ) {
      return Promise.reject(error);
    }

    // 🔒 Token expired / invalid
    if ((status === 401 || status === 403) && currentPath !== "/login") {
      localStorage.removeItem("user");
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
