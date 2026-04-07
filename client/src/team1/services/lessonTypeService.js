import { extractItems, lessonTypeAPI } from "./api";

export async function getLessonTypes() {
  const payload = await lessonTypeAPI.getAll();
  return extractItems(payload);
}
