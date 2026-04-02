import api from "./api";

export function getLessonsByCourse(courseId) {
  return api.get(`/v1/lessons?course_id=${courseId}`).then((data) => ({ data }));
}

export function createLesson(data) {
  return api.post("/v1/lessons", data);
}
