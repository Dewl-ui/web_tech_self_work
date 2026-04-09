import { extractItems, requestAPI, roleAPI } from "./api";
import { getCurrentSchool } from "../utils/school";

const ROLE_NAME_CANDIDATES = {
  teacher: ["сургагч", "багш", "teacher", "school teacher", "school_teacher"],
  schooladmin: ["админ", "сургуулийн админ", "school admin", "school_admin", "schooladmin"],
};

async function getRoles() {
  const payload = await roleAPI.getAll();
  return extractItems(payload);
}

async function findRoleId(roleKey) {
  const roles = await getRoles();
  const candidates = ROLE_NAME_CANDIDATES[roleKey] || [roleKey];
  const matchedRole = roles.find((role) =>
    candidates.includes(String(role?.name || "").trim().toLowerCase())
  );

  return matchedRole?.id ? String(matchedRole.id) : "";
}

function decorateSchoolRequest(request) {
  return {
    ...request,
    request_type: "school_admin",
    request_scope: "school_request",
  };
}

function decorateMembershipRequest(request) {
  return {
    ...request,
    request_type: Number(request?.role_id) > 0 ? "teacher" : "school_member",
    request_scope: "school_membership",
  };
}

export async function getRequests() {
  const currentSchool = getCurrentSchool();
  const [schoolRequests, membershipRequests] = await Promise.all([
    requestAPI
      .getSchoolRequests()
      .then((payload) => extractItems(payload).map(decorateSchoolRequest))
      .catch(() => []),
    currentSchool?.id
      ? requestAPI
          .getBySchool(currentSchool.id)
          .then((payload) => extractItems(payload).map(decorateMembershipRequest))
          .catch(() => [])
      : Promise.resolve([]),
  ]);

  return [...schoolRequests, ...membershipRequests].sort(
    (left, right) => Number(right?.id || 0) - Number(left?.id || 0)
  );
}

export async function createRequest(data) {
  const currentSchool = getCurrentSchool();
  const type = String(data?.type || "").toLowerCase();

  if (type === "school_admin") {
    const payload = {
      name: String(data?.name || "").trim(),
      picture: data?.picture || "",
    };

    if (data?.parent_id) {
      payload.parent_id = String(data.parent_id);
    }

    return requestAPI.createSchoolRequest(payload);
  }

  const schoolId = Number(data?.school_id || currentSchool?.id || 0);
  if (!schoolId) {
    throw new Error("Хүсэлт илгээх сургуулийн мэдээлэл олдсонгүй.");
  }

  const roleId = await findRoleId("teacher");
  if (!roleId) {
    throw new Error("Багшийн эрхийн дугаар олдсонгүй.");
  }

  return requestAPI.createBySchool(schoolId, {
    description:
      data?.description ||
      (data?.course_id
        ? `Хичээл ${data.course_id}-д багш эрх хүссэн.`
        : "Сургуульд багш эрх хүссэн."),
    role_id: roleId,
  });
}

export async function approveRequest(request) {
  if (request?.request_scope === "school_membership") {
    return requestAPI.approveBySchool(request.school_id, request.id, {});
  }

  return requestAPI.approveSchoolRequest(request.id);
}

export async function rejectRequest(request, rejectionReason = "") {
  if (request?.request_scope === "school_membership") {
    return requestAPI.rejectBySchool(request.school_id, request.id, {});
  }

  return requestAPI.rejectSchoolRequest(request.id, {
    rejection_reason: rejectionReason,
  });
}
