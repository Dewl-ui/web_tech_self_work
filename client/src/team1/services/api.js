const BASE_URL = "https://todu.mn/bs/lms";

function getToken() {
  return localStorage.getItem("token");
}

async function request(method, path, data) {
  const headers = {};
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const hasBody = data !== undefined;

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: hasBody ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json().catch(() => null);
}

const api = {
  get: (path) => request("GET", path),
  post: (path, data) => request("POST", path, data),
  put: (path, data) => request("PUT", path, data),
  delete: (path) => request("DELETE", path),
};

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function canCreate(user) {
  return Boolean(user && [1, 3, 4].includes(user.role_id));
}

export function canEdit(user) {
  return Boolean(user && [1, 3, 4].includes(user.role_id));
}

export function canDelete(user) {
  return Boolean(user && [1, 3].includes(user.role_id));
}

export function isStudent(user) {
  return Boolean(user && user.role_id === 5);
}

export const authAPI = {
  login: (email, password) => request("POST", "/v1/token/email", { email, password }),
  me: () => request("GET", "/v1/users/me"),
  logout: () => request("DELETE", "/v1/token"),
};

export const courseAPI = {
  getAll: () => request("GET", "/v1/courses"),
  getOne: (courseId) => request("GET", `/v1/courses/${courseId}`),
  create: (data) => request("POST", "/v1/courses", data),
  update: (courseId, data) => request("PUT", `/v1/courses/${courseId}`, data),
  delete: (courseId) => request("DELETE", `/v1/courses/${courseId}`),
};

export const lessonAPI = {
  getAll: (courseId) => request("GET", `/v1/courses/${courseId}/lessons`),
  getOne: (courseId, lessonId) =>
    request("GET", `/v1/courses/${courseId}/lessons/${lessonId}`),
  create: (courseId, data) =>
    request("POST", `/v1/courses/${courseId}/lessons`, data),
  update: (courseId, lessonId, data) =>
    request("PUT", `/v1/courses/${courseId}/lessons/${lessonId}`, data),
  delete: (courseId, lessonId) =>
    request("DELETE", `/v1/courses/${courseId}/lessons/${lessonId}`),
};

export const schoolAPI = {
  getAll: () => request("GET", "/v1/schools"),
  getOne: (id) => request("GET", `/v1/schools/${id}`),
  create: (data) => request("POST", "/v1/schools", data),
  update: (id, data) => request("PUT", `/v1/schools/${id}`, data),
  delete: (id) => request("DELETE", `/v1/schools/${id}`),
};

export const categoryAPI = {
  getAll: () => request("GET", "/v1/categories"),
};

export default api;
