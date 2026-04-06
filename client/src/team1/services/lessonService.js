import { extractItem, extractItems, lessonAPI } from "./api";

function sanitizeLessonPayload(data = {}) {
  const toOptionalString = (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return String(value).trim();
  };

  const payload = {
    name: String(data.name || "").trim(),
    parent_id: toOptionalString(data.parent_id),
    priority: toOptionalString(data.priority ?? "1"),
    type_id: toOptionalString(data.type_id ?? "2"),
    content: String(data.content || "").trim(),
    has_submission:
      data.has_submission === true || data.has_submission === 1 || data.has_submission === "1"
        ? "1"
        : "0",
    point: toOptionalString(data.point ?? "0"),
    open_on: toOptionalString(data.open_on),
    close_on: toOptionalString(data.close_on),
    end_on: toOptionalString(data.end_on),
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
}

export async function getLessonsByCourse(courseId) {
  const payload = await lessonAPI.getAll(courseId);
  return extractItems(payload);
}

export async function getLesson(courseId, lessonId) {
  const payload = await lessonAPI.getOne(courseId, lessonId);
  return extractItem(payload);
}

export async function createLesson(courseId, data) {
  const payload = await lessonAPI.create(courseId, sanitizeLessonPayload(data));
  return extractItem(payload);
}

export async function updateLesson(courseId, lessonId, data) {
  const payload = await lessonAPI.update(courseId, lessonId, sanitizeLessonPayload(data));
  return extractItem(payload);
}

export async function deleteLesson(courseId, lessonId) {
  return lessonAPI.delete(courseId, lessonId);
}
