import { courseAPI, extractItem, extractItems } from "./api";

function sanitizeCoursePayload(data = {}) {
  const payload = {
    name: data.name,
    picture: data.picture,
    cloned_course_id: data.cloned_course_id,
    category_id: data.category_id,
    school_id: data.school_id,
    description: data.description,
    start_on: data.start_on,
    end_on: data.end_on,
    priority: data.priority,
    access_type_id: data.access_type_id,
    price: data.price,
    credits: data.credits,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
}

export async function getCoursesBySchool(schoolId) {
  const payload = await courseAPI.getBySchool(schoolId);
  return extractItems(payload);
}

export async function getCoursesBySchoolAndCategory(schoolId, categoryId) {
  const items = await getCoursesBySchool(schoolId);
  return items.filter(
    (item) => Number(item?.category_id) === Number(categoryId)
  );
}

export async function getCourse(courseId) {
  const payload = await courseAPI.getOne(courseId);
  return extractItem(payload);
}

export async function createCourse(schoolId, data) {
  const payload = await courseAPI.create(schoolId, sanitizeCoursePayload(data));
  return extractItem(payload);
}

export async function updateCourse(schoolId, courseId, data) {
  const payload = await courseAPI.update(
    schoolId,
    courseId,
    sanitizeCoursePayload(data)
  );
  return extractItem(payload);
}

export async function deleteCourse(schoolId, courseId) {
  return courseAPI.delete(schoolId, courseId);
}

export async function moveCourseToCategory(schoolId, course, categoryId) {
  return updateCourse(schoolId, course.id, {
    name: course.name,
    picture: course.picture,
    cloned_course_id: course.cloned_course_id || course.clone_id || null,
    category_id: categoryId,
    school_id: schoolId,
    description: course.description,
    start_on: course.start_on,
    end_on: course.end_on,
    priority: course.priority,
    access_type_id: course.access_type_id,
    price: course.price,
    credits: course.credits,
  });
}
