import { authFetch, extractItems } from "./api";
import { findRoleId } from "./roleService";

async function parseResponse(response) {
  return response.json().catch(() => null);
}

async function ensureOk(response) {
  const payload = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(
      payload?.message || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.response = {
      status: response.status,
      data: payload,
    };
    throw error;
  }

  return payload;
}

function parseRoleName(entry) {
  const rawRole =
    entry?.school_role_name ||
    entry?.role?.name ||
    entry?.role_name ||
    entry?.role ||
    entry?.["{}role"] ||
    "";

  if (typeof rawRole === "string") {
    try {
      const parsed = JSON.parse(rawRole);
      return parsed?.name || rawRole;
    } catch {
      return rawRole;
    }
  }

  return rawRole?.name || "";
}

function parseRoleId(entry) {
  return (
    entry?.school_role_id ||
    entry?.role?.id ||
    entry?.role_id ||
    null
  );
}

export async function getSchoolUsers(schoolId) {
  let offset = 0;
  const limit = 100;
  let hasMore = true;
  const allItems = [];

  while (hasMore) {
    const response = await authFetch(
      `/schools/${schoolId}/users?offset=${offset}&limit=${limit}`
    );
    const payload = await ensureOk(response);
    const items = extractItems(payload);

    allItems.push(...items);

    hasMore = Boolean(payload?.hasMore);
    offset += items.length || limit;

    if (!items.length) {
      hasMore = false;
    }
  }

  return allItems;
}

export async function getUserById(userId) {
  const response = await authFetch(`/users/${userId}`);
  return ensureOk(response);
}

export async function getUserSchools(userId) {
  const response = await authFetch(`/users/${userId}/schools`);
  const payload = await ensureOk(response);
  return extractItems(payload);
}

export async function getSchoolUsersWithRoles(schoolId) {
  const users = await getSchoolUsers(schoolId);
  const chunkSize = 10;
  const resolved = [];

  for (let index = 0; index < users.length; index += chunkSize) {
    const chunk = users.slice(index, index + chunkSize);

    const chunkResolved = await Promise.all(
      chunk.map(async (user) => {
        try {
          const schools = await getUserSchools(user.id || user.user_id);
          const matchedSchool = schools.find(
            (item) => Number(item?.id || item?.school_id) === Number(schoolId)
          );

          const directRoleName = parseRoleName(user);
          const directRoleId = parseRoleId(user);
          const matchedRoleName = parseRoleName(matchedSchool);
          const matchedRoleId = parseRoleId(matchedSchool);

          return {
            ...user,
            school_role_name:
              directRoleName || matchedRoleName || "Суралцагч",
            school_role_id: directRoleId || matchedRoleId || null,
          };
        } catch {
          return {
            ...user,
            school_role_name: parseRoleName(user) || "Тодорхойгүй",
            school_role_id: parseRoleId(user),
          };
        }
      })
    );

    resolved.push(...chunkResolved);
  }

  return resolved;
}

export async function addSchoolUser(schoolId, data) {
  const response = await authFetch(`/schools/${schoolId}/users`, {
    method: "POST",
    body: JSON.stringify({
      username: String(data?.username || "").trim(),
      role_id: String(data?.role_id || "").trim(),
    }),
  });

  return ensureOk(response);
}

export async function removeSchoolUser(schoolId, userId) {
  const response = await authFetch(`/schools/${schoolId}/users/${userId}`, {
    method: "DELETE",
  });

  if (response.status === 204) {
    return null;
  }

  return ensureOk(response);
}

export async function restoreSchoolUserRole(
  schoolId,
  userId,
  targetRoleKey = "student"
) {
  const [users, roleId] = await Promise.all([
    getSchoolUsers(schoolId),
    findRoleId(targetRoleKey),
  ]);

  if (!roleId) {
    throw new Error("Буцаах эрхийн дугаар олдсонгүй.");
  }

  const matchedUser = users.find(
    (item) => Number(item?.id || item?.user_id) === Number(userId)
  );

  let resolvedUser = matchedUser;

  if (!resolvedUser?.username) {
    resolvedUser = await getUserById(userId).catch(() => null);
  }

  if (!resolvedUser?.username) {
    throw new Error("Эрх буцаах хэрэглэгчийн мэдээлэл олдсонгүй.");
  }

  await removeSchoolUser(schoolId, userId);

  return addSchoolUser(schoolId, {
    username: resolvedUser.username,
    role_id: roleId,
  });
}
