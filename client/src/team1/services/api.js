export const BASE_URL = "https://todu.mn/bs/lms/v1";

function getToken() {
  const rawToken = localStorage.getItem("access_token");

  if (!rawToken) {
    return "";
  }

  const trimmed = String(rawToken).trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function getRefreshToken() {
  const rawToken = localStorage.getItem("refresh_token");

  if (!rawToken) {
    return "";
  }

  const trimmed = String(rawToken).trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function stripCurrentUser(value) {
  if (Array.isArray(value)) {
    return value.map(stripCurrentUser);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((result, [key, entryValue]) => {
      if (key === "current_user") {
        return result;
      }

      result[key] = stripCurrentUser(entryValue);
      return result;
    }, {});
  }

  return value;
}

function createHeaders(hasBody, token = getToken()) {
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (hasBody) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

async function parsePayload(response) {
  return response.json().catch(() => null);
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return "";
  }

  const response = await fetch(`${BASE_URL}/token/refresh`, {
    method: "POST",
    headers: createHeaders(true, ""),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const payload = await parsePayload(response);

  if (!response.ok || !payload?.access_token) {
    return "";
  }

  localStorage.setItem("access_token", payload.access_token);

  if (payload.refresh_token) {
    localStorage.setItem("refresh_token", payload.refresh_token);
  }

  return payload.access_token;
}

export async function authFetch(path, init = {}, retry = true) {
  const method = init.method || "GET";
  const body = init.body;
  const hasBody = body !== undefined && body !== null;
  const token = getToken();
  const headers = createHeaders(hasBody, token);

  if (init.headers) {
    new Headers(init.headers).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    method,
    headers,
    body,
  });

  if ((response.status === 401 || response.status === 403) && retry) {
    const nextToken = await refreshAccessToken();

    if (nextToken) {
      return authFetch(path, init, false);
    }
  }

  return response;
}

async function request(method, path, data) {
  const sanitizedBody = data !== undefined ? JSON.stringify(stripCurrentUser(data)) : undefined;

  const response = await authFetch(path, {
    method,
    body: sanitizedBody,
  });

  const payload = await parsePayload(response);

  if (!response.ok) {
    const error = new Error(
      payload?.message || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.response = {
      status: response.status,
      data: payload,
    };
    throw error;
  }

  return payload;
}

const api = {
  get: (path) => request("GET", path),
  post: (path, data) => request("POST", path, data),
  put: (path, data) => request("PUT", path, data),
  delete: (path, data) => request("DELETE", path, data),
};

export function extractItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

export function extractItem(payload) {
  if (!payload) {
    return null;
  }

  if (payload.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload.item || payload.result || payload;
}

export const schoolAPI = {
  getAll: () => api.get("/schools"),
  getOne: (schoolId) => api.get(`/schools/${schoolId}`),
  getTeachers: (schoolId) => api.get(`/schools/${schoolId}/teachers`),
  create: (data) => api.post("/schools", data),
  update: (schoolId, data) => api.put(`/schools/${schoolId}`, data),
  delete: (schoolId) => api.delete(`/schools/${schoolId}`),
};

export const categoryAPI = {
  getBySchool: (schoolId) => api.get(`/schools/${schoolId}/categories`),
  getOne: (categoryId) => api.get(`/categories/${categoryId}`),
  getCourses: (categoryId) => api.get(`/categories/${categoryId}/courses`),
  create: (schoolId, data) => api.post(`/schools/${schoolId}/categories`, data),
  update: (categoryId, data) => api.put(`/categories/${categoryId}`, data),
  delete: (categoryId) => api.delete(`/categories/${categoryId}`),
  removeCourse: (categoryId, courseId) =>
    api.delete(`/categories/${categoryId}/courses/${courseId}`),
};

export const courseAPI = {
  getBySchool: (schoolId) => api.get(`/schools/${schoolId}/courses`),
  getOne: (courseId) => api.get(`/courses/${courseId}`),
  create: (schoolId, data) => api.post(`/schools/${schoolId}/courses`, data),
  update: (_schoolId, courseId, data) =>
    api.put(`/courses/${courseId}`, data),
  delete: (_schoolId, courseId) =>
    api.delete(`/courses/${courseId}`),
};

export const lessonAPI = {
  getAll: (courseId) => api.get(`/courses/${courseId}/lessons`),
  getOne: (_courseId, lessonId) => api.get(`/lessons/${lessonId}`),
  create: (courseId, data) => api.post(`/courses/${courseId}/lessons`, data),
  update: (_courseId, lessonId, data) =>
    api.put(`/lessons/${lessonId}`, data),
  delete: (_courseId, lessonId) =>
    api.delete(`/lessons/${lessonId}`),
};

export const lessonTypeAPI = {
  getAll: () => api.get("/lesson-types"),
};

export const roleAPI = {
  getAll: () => api.get("/roles"),
};

export const requestAPI = {
  getSchoolRequests: () => api.get("/school-requests"),
  createSchoolRequest: (data) => api.post("/school-requests", data),
  getBySchool: (schoolId) => api.get(`/schools/${schoolId}/requests`),
  createBySchool: (schoolId, data) => api.post(`/schools/${schoolId}/requests`, data),
  approveSchoolRequest: (requestId) =>
    api.post(`/school-requests/${requestId}/approve`, {}),
  rejectSchoolRequest: (requestId, data) =>
    api.post(`/school-requests/${requestId}/reject`, data || {}),
  approveBySchool: (schoolId, requestId, data) =>
    api.post(`/schools/${schoolId}/requests/${requestId}`, data || {}),
  rejectBySchool: (schoolId, requestId, data) =>
    api.delete(`/schools/${schoolId}/requests/${requestId}`, data || {}),
};

export default api;
