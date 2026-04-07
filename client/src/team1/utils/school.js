import { authFetch } from "../services/api";

export const setCurrentSchool = (school) => {
  if (!school) {
    localStorage.removeItem("selectedSchool");
    localStorage.removeItem("school");
    window.dispatchEvent(new CustomEvent("team1-school-change", { detail: null }));
    return;
  }

  const serialized = JSON.stringify(school);
  localStorage.setItem("selectedSchool", serialized);
  localStorage.setItem("school", serialized);
  window.dispatchEvent(new CustomEvent("team1-school-change", { detail: school }));
  syncRoleFromAuthenticatedUser();
};

export const getCurrentSchool = () => {
  try {
    return JSON.parse(
      localStorage.getItem("selectedSchool") || localStorage.getItem("school")
    );
  } catch {
    return null;
  }
};

export const setRole = (role) => {
  const nextRole = typeof role === "string" && role.trim() ? role : "student";
  localStorage.setItem("role", nextRole.toLowerCase());
  window.dispatchEvent(new CustomEvent("team1-role-change", { detail: nextRole.toLowerCase() }));
};

function setCurrentUserProfile(user) {
  if (!user) {
    localStorage.removeItem("team1_user");
    window.dispatchEvent(new CustomEvent("team1-user-change", { detail: null }));
    return;
  }

  localStorage.setItem("team1_user", JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("team1-user-change", { detail: user }));
}

export function getCurrentUserProfile() {
  try {
    return JSON.parse(localStorage.getItem("team1_user") || "null");
  } catch {
    return null;
  }
}

function decodeJwtPayload(token) {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function normalizeRoleName(value, options = {}) {
  const raw = String(value || "").trim().toLowerCase();
  const { schoolScoped = false } = options;

  if (!raw) {
    return "";
  }

  if (schoolScoped) {
    if (
      [
        "schooladmin",
        "school_admin",
        "school admin",
        "админ",
        "сургуулийн админ",
      ].includes(raw)
    ) {
      return "schooladmin";
    }

    if (
      [
        "teacher",
        "schoolteacher",
        "school_teacher",
        "school teacher",
        "багш",
        "сургуулийн багш",
      ].includes(raw)
    ) {
      return "teacher";
    }

    if (
      [
        "student",
        "schoolstudent",
        "school_student",
        "school student",
        "сурагч",
        "оюутан",
      ].includes(raw)
    ) {
      return "student";
    }
  }

  if (
    [
      "systemadmin",
      "admin",
      "system_admin",
      "админ",
      "системийн админ",
      "system admin",
    ].includes(raw)
  ) {
    return "systemadmin";
  }

  if (
    [
      "schooladmin",
      "school_admin",
      "сургуулийн админ",
      "school admin",
    ].includes(raw)
  ) {
    return "schooladmin";
  }

  if (
    [
      "teacher",
      "schoolteacher",
      "school_teacher",
      "багш",
      "сургуулийн багш",
      "school teacher",
    ].includes(raw)
  ) {
    return "teacher";
  }

  if (
    [
      "student",
      "schoolstudent",
      "school_student",
      "user",
      "сурагч",
      "оюутан",
      "school student",
    ].includes(raw)
  ) {
    return "student";
  }

  return raw;
}

export const getRole = () => {
  return normalizeRoleName(localStorage.getItem("role") || "");
};

export const setCurrentCourse = (course) => {
  if (!course) {
    localStorage.removeItem("currentCourse");
    return;
  }

  localStorage.setItem("currentCourse", JSON.stringify(course));
};

export const getCurrentCourse = () => {
  try {
    return JSON.parse(localStorage.getItem("currentCourse") || "null");
  } catch {
    return null;
  }
};

export const setCurrentLesson = (lesson) => {
  if (!lesson) {
    localStorage.removeItem("currentLesson");
    return;
  }

  localStorage.setItem("currentLesson", JSON.stringify(lesson));
};

export const getCurrentLesson = () => {
  try {
    return JSON.parse(localStorage.getItem("currentLesson") || "null");
  } catch {
    return null;
  }
};

function getCompletionUserKey() {
  const user = getCurrentUserProfile();
  return String(user?.id || user?.email || user?.username || "guest");
}

function getCompletionStorageKey() {
  return `team1_lesson_completion_${getCompletionUserKey()}`;
}

function readCompletionStore() {
  try {
    return JSON.parse(localStorage.getItem(getCompletionStorageKey()) || "{}");
  } catch {
    return {};
  }
}

function writeCompletionStore(store) {
  localStorage.setItem(getCompletionStorageKey(), JSON.stringify(store));
  window.dispatchEvent(
    new CustomEvent("team1-lesson-completion-change", { detail: store })
  );
}

export function getCompletedLessonIds(courseId) {
  const store = readCompletionStore();
  const items = store?.[String(courseId)];
  return Array.isArray(items) ? items : [];
}

export function isLessonCompleted(courseId, lessonId) {
  return getCompletedLessonIds(courseId).some(
    (item) => Number(item) === Number(lessonId)
  );
}

export function setLessonCompleted(courseId, lessonId, completed) {
  const store = readCompletionStore();
  const key = String(courseId);
  const currentItems = Array.isArray(store[key]) ? store[key] : [];
  const nextItems = completed
    ? Array.from(new Set([...currentItems, Number(lessonId)]))
    : currentItems.filter((item) => Number(item) !== Number(lessonId));

  store[key] = nextItems;
  writeCompletionStore(store);
  return nextItems;
}

export const isStudent = (role = getRole()) => role === "student";
export const isSchoolAdmin = (role = getRole()) => role === "schooladmin";
export const isTeacher = (role = getRole()) => role === "teacher";
export const isSystemAdmin = (role = getRole()) => role === "systemadmin";
export const canManageTeam1Content = (role = getRole()) =>
  isTeacher(role) || isSchoolAdmin(role) || isSystemAdmin(role);

export const canCreateSchool = (role = getRole()) =>
  isSchoolAdmin(role) || isSystemAdmin(role);
export const canCreateCategory = (role = getRole()) =>
  isSchoolAdmin(role) || isSystemAdmin(role);
export const canCreateCourse = (role = getRole()) =>
  isSchoolAdmin(role) || isSystemAdmin(role);
export const canCreateLesson = (role = getRole()) =>
  isTeacher(role) || isSchoolAdmin(role) || isSystemAdmin(role);
export const canManageCourseStudents = (role = getRole()) =>
  isTeacher(role) || isSchoolAdmin(role) || isSystemAdmin(role);
export const canDeleteCourse = (role = getRole()) =>
  isSchoolAdmin(role) || isSystemAdmin(role);
export const canDeleteLesson = (role = getRole()) =>
  isTeacher(role) || isSystemAdmin(role);

export const getErrorMessage = (error, fallback) => {
  if (error?.response?.status === 403) {
    return "Сервер таны одоогийн эрхээр энэ үйлдлийг зөвшөөрсөнгүй.";
  }

  if (error?.response?.status === 555) {
    return "Илгээж буй өгөгдөл серверийн шаардлагад тохирохгүй байна.";
  }

  if (String(error?.message || "").includes("user defined resource")) {
    return "Илгээж буй өгөгдөл серверийн шаардлагад тохирохгүй байна.";
  }

  return error?.message || fallback;
};

export function toApiIsoString(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().replace(".000Z", "Z");
}

export function getRoleLabel(role = getRole()) {
  if (isSystemAdmin(role)) return "Системийн админ";
  if (isSchoolAdmin(role)) return "Сургуулийн админ";
  if (isTeacher(role)) return "Багш";
  return "Сурагч";
}

function buildUserProfile(user, resolvedRole) {
  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const fullName = `${lastName} ${firstName}`.trim();
  const username = user?.username || user?.email || "Хэрэглэгч";

  return {
    id: user?.id || null,
    first_name: firstName,
    last_name: lastName,
    family_name: user?.family_name || "",
    picture: user?.picture || "",
    username,
    email: user?.email || "",
    name: fullName || username,
    role: resolvedRole || getRole(),
  };
}

function buildUserProfileFromToken(token, resolvedRole) {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  const firstName = payload?.first_name || payload?.given_name || "";
  const lastName = payload?.last_name || payload?.family_name || "";
  const username =
    payload?.username ||
    payload?.preferred_username ||
    payload?.email ||
    payload?.sub ||
    "Хэрэглэгч";
  const fullName =
    payload?.name || `${lastName} ${firstName}`.trim() || username;

  return {
    id: payload?.id || payload?.user_id || payload?.sub || null,
    first_name: firstName,
    last_name: lastName,
    family_name: payload?.family_name || "",
    picture: payload?.picture || "",
    username,
    email: payload?.email || "",
    name: fullName,
    role: resolvedRole || getRole(),
  };
}

function parseSchoolRoleEntry(entry) {
  if (!entry) {
    return "";
  }

  if (typeof entry === "string") {
    try {
      const parsed = JSON.parse(entry);
      return normalizeRoleName(parsed?.name || parsed?.role_name || "", {
        schoolScoped: true,
      });
    } catch {
      return normalizeRoleName(entry, { schoolScoped: true });
    }
  }

  return normalizeRoleName(
    entry?.name || entry?.role_name || entry?.role?.name || "",
    { schoolScoped: true }
  );
}

function inferRoleFromIdentity(user) {
  const directRole = normalizeRoleName(
    user?.role?.name ||
      user?.role_name ||
      user?.role ||
      user?.user_role ||
      user?.authority ||
      ""
  );

  if (directRole) {
    return directRole;
  }

  const identity = `${user?.username || ""} ${user?.email || ""}`.toLowerCase();

  if (identity.includes("schoolteacher") || identity.includes("teacher")) {
    return "teacher";
  }

  if (identity.includes("schooladmin")) {
    return "schooladmin";
  }

  if (identity.includes("admin")) {
    return "systemadmin";
  }

  if (identity.includes("student") || identity.includes("user")) {
    return "student";
  }

  return "";
}

export async function syncRoleFromAuthenticatedUser() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return getRole();
  }

  const cachedRole = getRole();
  const tokenProfile = buildUserProfileFromToken(token, cachedRole);
  if (tokenProfile) {
    setCurrentUserProfile(tokenProfile);
  }

  try {
    const response = await authFetch("/users/me");

    if (!response.ok) {
      return getRole();
    }

    const me = await response.json().catch(() => null);
    if (!me) {
      return getRole();
    }

    const currentSchool = getCurrentSchool();
    const schoolEntries =
      me?.schools?.items || me?.schools || me?.items || [];

    if (currentSchool?.id && Array.isArray(schoolEntries)) {
      const matchedSchool = schoolEntries.find(
        (entry) => Number(entry?.id || entry?.school_id) === Number(currentSchool.id)
      );

      const matchedRole = parseSchoolRoleEntry(
        matchedSchool?.["{}role"] || matchedSchool?.role || matchedSchool?.role_name
      );

      if (matchedRole) {
        setCurrentUserProfile(buildUserProfile(me, matchedRole));
        setRole(matchedRole);
        return matchedRole;
      }
    }

    const inferredRole = inferRoleFromIdentity(me);
    if (inferredRole) {
      setCurrentUserProfile(buildUserProfile(me, inferredRole));
      setRole(inferredRole);
      return inferredRole;
    }

    setCurrentUserProfile(buildUserProfile(me, getRole()));
  } catch {
    if (tokenProfile) {
      setCurrentUserProfile(tokenProfile);
    }
    return getRole();
  }

  return getRole();
}
