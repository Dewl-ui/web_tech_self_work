import { authFetch, extractItems } from "./api";

function parseMaybeJson(value) {
  if (typeof value !== "string") {
    return value;
  }

  const text = value.trim();
  if (!text.startsWith("{") && !text.startsWith("[")) {
    return value;
  }

  try {
    return JSON.parse(text);
  } catch {
    return value;
  }
}

function normalizeCourseUser(item = {}, index = 0) {
  const nestedUser =
    parseMaybeJson(item["{}user"]) ||
    item.user ||
    item["{}USER"] ||
    {};
  const resolved = typeof nestedUser === "object" && nestedUser ? nestedUser : {};

  return {
    ...item,
    ...resolved,
    id: item.user_id || resolved.id || item.id || index + 1,
    user_id: item.user_id || resolved.id || item.id || index + 1,
    email: resolved.email || item.email || "",
    username: resolved.username || item.username || "",
    first_name: resolved.first_name || item.first_name || "",
    last_name: resolved.last_name || item.last_name || "",
    picture: resolved.picture || item.picture || "",
    progress:
      item.progress ??
      item.completed_percent ??
      item.completion_percent ??
      item.attendance_percent ??
      resolved.progress ??
      0,
  };
}

async function parseResponse(response) {
  return response.json().catch(() => null);
}

async function ensureOk(response) {
  const payload = await parseResponse(response);

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

export async function getCourseUsers(courseId) {
  const response = await authFetch(`/courses/${courseId}/users`);
  const payload = await ensureOk(response);
  return extractItems(payload).map((item, index) => normalizeCourseUser(item, index));
}

export async function addCourseUser(courseId, userId, groupId = null) {
  const body = {
    user_id: String(userId),
  };

  if (groupId !== null && groupId !== undefined && groupId !== "") {
    body.group_id = String(groupId);
  }

  const response = await authFetch(`/courses/${courseId}/users`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return ensureOk(response);
}

export async function removeCourseUser(courseId, userId) {
  const response = await authFetch(`/courses/${courseId}/users/${userId}`, {
    method: "DELETE",
  });

  if (response.status === 204) {
    return null;
  }

  return ensureOk(response);
}

export async function findUserByEmail(email) {
  const response = await authFetch("/users");
  const payload = await ensureOk(response);
  const users = extractItems(payload).map((item, index) => normalizeCourseUser(item, index));
  const normalizedEmail = String(email || "").trim().toLowerCase();

  return (
    users.find(
      (user) =>
        String(user.email || "").trim().toLowerCase() === normalizedEmail ||
        String(user.username || "").trim().toLowerCase() === normalizedEmail
    ) || null
  );
}
