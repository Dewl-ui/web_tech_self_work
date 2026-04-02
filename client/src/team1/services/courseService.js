import api from "./api";

export async function getCourses() {
  const data = await api.get("/v1/courses");
  return { data };
}

export async function createCourse(data) {
  return api.post("/v1/courses", data);
}
