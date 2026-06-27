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
 * Simple fetch‑based helper for unauthenticated POST requests.
 * Used by pages that run before a token exists (e.g., OAuth callback,
 * access‑request form).
 */
export async function publicPost(path, body) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  // Existing endpoints
  getContests: () => client.get("/contests").then((r) => r.data),
  getProfile: () => client.get("/user/profile").then((r) => r.data),
  updatePlatforms: (platforms) =>
    client.put("/user/platforms", { platforms }).then((r) => r.data),
  pauseSync: () => client.put("/user/pause").then((r) => r.data),
  resumeSync: () => client.put("/user/resume").then((r) => r.data),

  // Sync endpoint gets a longer timeout (45 s) to accommodate backend retries & Google API latency
  triggerSync: () =>
    client.post("/sync", null, { timeout: 45000 }).then((r) => r.data),

  // Admin endpoints
  getAdminUsers: () => client.get("/admin/users").then((r) => r.data),
  getAdminAccessRequests: () => client.get("/admin/access-requests").then((r) => r.data),
  approveAccessRequest: (id) => client.post(`/admin/approve/${id}`).then((r) => r.data),
  manualApprove: (email) => client.post("/admin/manual-approve", { email }).then((r) => r.data),
};