const TOKEN_KEY = "cpsync_jwt";

let _token = null;

export function saveToken(token) {
  _token = token;
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken() {
  return _token || sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  _token = null;
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getLoginUrl() {
  return import.meta.env.VITE_AUTH_URL;
}

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
 * The backend now includes `"role": "ADMIN"` for the admin user.
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