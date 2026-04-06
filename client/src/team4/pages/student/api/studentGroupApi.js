// ============================================================
// Student Group API — Member C OWNS this file
// Self-contained: no imports from team4/utils/api.
// Endpoints verified against group.check.http (Apr 2026).
//
// API shape reference:
//   GET /courses/:courseId/groups
//     → { items: [{id, course_id, name, priority, created_on, updated_on}], count, hasMore }
//
//   GET /groups/:groupId
//     → { id, course_id, name, priority, created_on, updated_on, links }
//
//   GET /courses/:courseId/users
//     → { items: [{user_id, group_id, group:{id,name}, user:{id,first_name,last_name,username,email,picture}}], count, hasMore }
// ============================================================

import { STORAGE_KEYS } from "../../../../utils/constants";

const BASE_URL = "https://todu.mn/bs/lms/v1";

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
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

const groupGet = (path) => request("GET", path);

// ── Read-only (student) ────────────────────────────────────────────────────────

/**
 * List all groups inside a course.
 * Response: { items: Group[], count, hasMore, limit, offset }
 * Group: { id, course_id, name, priority, created_on, updated_on }
 */
export const getGroupsByCourse = (courseId) =>
  groupGet(`/courses/${courseId}/groups`);

/**
 * Get a single group's details.
 * Response: { id, course_id, name, priority, created_on, updated_on, links }
 */
export const getGroupDetail = (groupId) =>
  groupGet(`/groups/${groupId}`);

/**
 * List all users enrolled in a course together with their group assignment.
 * Useful for rendering a group roster on the student group page.
 * Response: { items: CourseMember[], count, hasMore }
 * CourseMember: { user_id, group_id, group:{id,name}, user:{id,first_name,last_name,username,email,picture} }
 *
 * Note: group_id / group.id can be null when the student is not assigned to any group.
 */
export const getCourseMembers = (courseId) =>
  groupGet(`/courses/${courseId}/users`);
