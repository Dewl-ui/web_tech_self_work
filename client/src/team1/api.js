// src/team1/api.js

const BASE_URL = "https://todu.mn/bs/lms/v1";

// Token авах
function getToken() {
  return localStorage.getItem("token");
}

// Нийтлэг fetch wrapper
async function request(method, path, body = null) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Алдаа: ${res.status}`);
  }

  return res.json();
}

// ==================== AUTH ====================
export const authAPI = {
  login: (email, password) =>
    request("POST", "/auth/login", { email, password }),
  me: () => request("GET", "/users/me"),
};

// ==================== COURSES ====================
export const courseAPI = {
  getAll: () => request("GET", "/courses"),
  getOne: (courseId) => request("GET", `/courses/${courseId}`),
  create: (data) => request("POST", "/courses", data),
  update: (courseId, data) => request("PUT", `/courses/${courseId}`, data),
  delete: (courseId) => request("DELETE", `/courses/${courseId}`),
};

// ==================== LESSONS ====================
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

// ==================== SCHOOLS ====================
export const schoolAPI = {
  getAll: () => request("GET", "/schools"),
  getOne: (schoolId) => request("GET", `/schools/${schoolId}`),
};

// ==================== CATEGORIES ====================
export const categoryAPI = {
  getAll: () => request("GET", "/categories"),
};