import api from '../config/api';

function persist(data) {
  // JSON.stringify(undefined) returns undefined, which setItem stores as the string "undefined"
  if (data.token && data.user) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data.user;
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return persist(data);
}

export async function register(email, password) {
  const { data } = await api.post('/auth/register', { email, password });
  return persist(data);
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    // ponytail: stale/corrupt value (e.g. the string "undefined") — drop it
    logout();
    return null;
  }
}
