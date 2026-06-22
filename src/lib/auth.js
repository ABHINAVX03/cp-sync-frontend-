const TOKEN_KEY = "cpsync_jwt";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

export function getLoginUrl() {
  return import.meta.env.VITE_AUTH_URL;
}

/**
 * Extracts the email from the JWT payload (does not verify signature).
 * Returns null if no token or unable to decode.
 */
export function getUserEmail() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || null;
  } catch (e) {
    return null;
  }
}