// src/team1/api.js
// Vite proxy: /bs/lms → https://todu.mn/bs/lms
// Тиймээс BASE_URL = "/bs/lms/v1" болно

const BASE_URL = "/bs/lms/v1";

function getToken() {
  return localStorage.getItem("token");
}

export function getCurrentUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function canCreate(user) {
  return user && [1, 3, 4].includes(user.role_id);
}
export function canEdit(user) {
  return user && [1, 3, 4].includes(user.role_id);
}
export function canDelete(user) {
  return user && [1, 3].includes(user.role_id);
}
export function isStudent(user) {
  return user && user.role_id === 5;
}

async function request(method, path, body = null) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/team4/login";
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Алдаа: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const authAPI = {
  login: (email, password) =>
    request("POST", "/token/email", { email, password }),
  me: () => request("GET", "/users/me"),
  logout: () => request("DELETE", "/token"),
};

export const courseAPI = {
  getAll: () => request("GET", "/courses"),
  getOne: (courseId) => request("GET", `/courses/${courseId}`),
  create: (data) => request("POST", "/courses", data),
  update: (courseId, data) => request("PUT", `/courses/${courseId}`, data),
  delete: (courseId) => request("DELETE", `/courses/${courseId}`),
};

export const lessonAPI = {
  getAll: (courseId) => request("GET", `/courses/${courseId}/lessons`),
  getOne: (courseId, lessonId) =>
    request("GET", `/courses/${courseId}/lessons/${lessonId}`),
  create: (courseId, data) =>
    request("POST", `/courses/${courseId}/lessons`, data),
  update: (courseId, lessonId, data) =>
    request("PUT", `/courses/${courseId}/lessons/${lessonId}`, data),
  delete: (courseId, lessonId) =>
    request("DELETE", `/courses/${courseId}/lessons/${lessonId}`),
};

export const schoolAPI = {
  getAll: () => request("GET", "/schools"),
  getOne: (id) => request("GET", `/schools/${id}`),
};

export const categoryAPI = {
  getAll: () => request("GET", "/categories"),
};