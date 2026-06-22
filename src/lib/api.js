import axios from "axios";
import { getToken, clearToken } from "./auth";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export const api = {
  getContests: () => client.get("/contests").then((r) => r.data),
  getProfile: () => client.get("/user/profile").then((r) => r.data),
  updatePlatforms: (platforms) =>
    client.put("/user/platforms", { platforms }).then((r) => r.data),
  pauseSync: () => client.put("/user/pause").then((r) => r.data),
  resumeSync: () => client.put("/user/resume").then((r) => r.data),
  triggerSync: () => client.post("/sync").then((r) => r.data),
};