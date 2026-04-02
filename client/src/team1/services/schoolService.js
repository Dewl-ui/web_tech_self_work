import api from "./api";

function pickItem(payload) {
  if (!payload || Array.isArray(payload)) {
    return payload;
  }

  return payload.data || payload.school || payload.result || payload;
}

export async function getSchools() {
  const data = await api.get("/v1/schools");
  return { data };
}

export async function getSchool(id) {
  const response = await api.get(`/v1/schools/${id}`);
  return pickItem(response);
}

export async function createSchool(data) {
  const response = await api.post("/v1/schools", data);
  return pickItem(response);
}

export async function updateSchool(id, data) {
  const response = await api.put(`/v1/schools/${id}`, data);
  return pickItem(response);
}

export async function deleteSchool(id) {
  return api.delete(`/v1/schools/${id}`);
}
