import { STORAGE_KEYS } from "../../../utils/constants";

const BASE_URL = "https://todu.mn/bs/lms/v1";

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function parseField(obj, key) {
  const raw = obj?.[`{}${key}`] ?? obj?.[key];
  if (raw == null) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return raw;
  }
}

async function request(method, path, body) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }

  return data;
}

export const studentGet    = (path)        => request("GET",    path);
export const studentPost   = (path, body)  => request("POST",   path, body);
export const studentPut    = (path, body)  => request("PUT",    path, body);
export const studentDelete = (path, body)  => request("DELETE", path, body);


export const getStudentProfile = () =>
  studentGet("/users/me");

export const updateStudentProfile = (body) =>
  studentPut("/users/me", body);

export const getStudentCourses = (userId) =>
  studentGet(`/users/${userId}/courses/enrolled`);

export const getCourseDetail = (courseId) =>
  studentGet(`/courses/${courseId}`);
