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
