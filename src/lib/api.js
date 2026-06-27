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

/**
 * Unauthenticated POST helper.  Pass an optional AbortSignal to cancel.
 */
export async function publicPost(path, body, signal) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  getContests: () => client.get("/contests").then((r) => r.data),
  getMyContests: () => client.get("/contests/mine").then((r) => r.data),
  getProfile: () => client.get("/user/profile").then((r) => r.data),
  updatePlatforms: (platforms) =>
    client.put("/user/platforms", { platforms }).then((r) => r.data),
  pauseSync: () => client.put("/user/pause").then((r) => r.data),
  resumeSync: () => client.put("/user/resume").then((r) => r.data),
  triggerSync: () =>
    client.post("/sync", null, { timeout: 45000 }).then((r) => r.data),
  getAdminUsers: () => client.get("/admin/users").then((r) => r.data),
  getAdminAccessRequests: () => client.get("/admin/access-requests").then((r) => r.data),
  approveAccessRequest: (id) => client.post(`/admin/approve/${id}`).then((r) => r.data),
  manualApprove: (email) => client.post("/admin/manual-approve", { email }).then((r) => r.data),
};