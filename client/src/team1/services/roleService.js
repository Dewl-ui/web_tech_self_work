import { extractItems, roleAPI } from "./api";

const ROLE_NAME_CANDIDATES = {
  teacher: ["сургагч", "багш", "teacher", "school teacher", "school_teacher"],
  schooladmin: ["админ", "сургуулийн админ", "school admin", "school_admin", "schooladmin"],
  student: ["суралцагч", "сурагч", "оюутан", "student", "school student", "school_student"],
};

export async function getRoles() {
  const payload = await roleAPI.getAll();
  return extractItems(payload);
}

export async function findRoleId(roleKey) {
  const roles = await getRoles();
  const candidates = ROLE_NAME_CANDIDATES[roleKey] || [roleKey];
  const matchedRole = roles.find((role) =>
    candidates.includes(String(role?.name || "").trim().toLowerCase())
  );

  return matchedRole?.id ? String(matchedRole.id) : "";
}
