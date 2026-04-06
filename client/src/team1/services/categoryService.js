import { categoryAPI, extractItem, extractItems } from "./api";

function sanitizeCategoryPayload(data = {}) {
  return Object.fromEntries(
    Object.entries({
      name: data.name,
      picture: data.picture,
      school_id: data.school_id,
      priority: data.priority ?? 1, // ← заавал 1 байна
      parent_id: data.parent_id,
    }).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
}

export async function getCategoriesBySchool(schoolId) {
  const payload = await categoryAPI.getBySchool(schoolId);
  return extractItems(payload);
}

export async function createCategory(schoolId, data) {
  const payload = await categoryAPI.create(
    schoolId,
    sanitizeCategoryPayload(data)
  );
  return extractItem(payload);
}

export async function updateCategory(categoryId, data) {
  const payload = await categoryAPI.update(
    categoryId,
    sanitizeCategoryPayload(data)
  );
  return extractItem(payload);
}

export async function deleteCategory(categoryId) {
  return categoryAPI.delete(categoryId);
}

export async function getCategory(categoryId) {
  const payload = await categoryAPI.getOne(categoryId);
  return extractItem(payload);
}

export async function getCoursesByCategory(categoryId) {
  const payload = await categoryAPI.getCourses(categoryId);
  return extractItems(payload);
}

export async function removeCourseFromCategory(categoryId, courseId) {
  return categoryAPI.removeCourse(categoryId, courseId);
}