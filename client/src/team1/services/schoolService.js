import { extractItem, extractItems, schoolAPI } from "./api";

export async function getSchools() {
  const payload = await schoolAPI.getAll();
  return extractItems(payload);
}

export async function getSchool(id) {
  const payload = await schoolAPI.getOne(id);
  return extractItem(payload);
}

export async function createSchool(data) {
  const payload = await schoolAPI.create(data);
  return extractItem(payload);
}

export async function updateSchool(id, data) {
  const payload = await schoolAPI.update(id, data);
  return extractItem(payload);
}

export async function deleteSchool(id) {
  return schoolAPI.delete(id);
}
