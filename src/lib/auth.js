const TOKEN_KEY = "cpsync_jwt";

// In-memory variable – survives hot reloads but not new tabs/restarts
let _token = null;

/**
 * Save token to memory and (optionally) to sessionStorage as a refresh fallback.
 * sessionStorage does not persist across new tabs, limiting XSS blast radius.
 */
export function saveToken(token) {
  _token = token;
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Retrieve token – prefer in‑memory, fall back to sessionStorage (page refresh).
 */
export function getToken() {
  return _token || sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Remove token from both memory and sessionStorage.
 */
export function clearToken() {
  _token = null;
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Check login state, including JWT expiry (issue 10).
 * Returns false if the token is missing, malformed, or expired.
 */
export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds; convert to ms and compare with current time
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getLoginUrl() {
  return import.meta.env.VITE_AUTH_URL;
}

/**
 * Decode the JWT payload and extract the email claim.
 * Returns null if token is missing or malformed.
 */
export function getUserEmail() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || null;
  } catch {
    return null;
  }
}

/**
 * Check if the current user is an admin by reading the `role` claim from the JWT.
 * Returns false if token is missing or invalid.
 *
 * IMPORTANT: Your backend must include `"role": "ADMIN"` (or `"admin": true`)
 * in the JWT payload for the admin user.  The backend still enforces access
 * control independently.
 */
export function isAdmin() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "ADMIN";
  } catch {
    return false;
  }
}