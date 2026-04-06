import { extractItems, requestAPI } from "./api";
import { toApiIsoString } from "../utils/school";

export async function getRequests() {
  const payload = await requestAPI.getAll();
  return extractItems(payload);
}

export async function createRequest(data) {
  return requestAPI.create({
    ...data,
    created_at: toApiIsoString(),
  });
}

export async function approveRequest(id) {
  return requestAPI.approve(id);
}

export async function rejectRequest(id) {
  return requestAPI.reject(id);
}
