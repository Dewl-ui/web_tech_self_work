import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SchoolHeader from "../../components/school/SchoolHeader";
import SchoolStats from "../../components/school/SchoolStats";
import useTeam1Role from "../../hooks/useTeam1Role";
import {
  deleteSchool,
  getSchool,
  getSchoolTeachers,
} from "../../services/schoolService";
import {
  restoreSchoolUserRole,
  getSchoolUsersWithRoles,
  getUserById,
} from "../../services/schoolUserService";
import { getSchoolMembershipRequests } from "../../services/requestService";
import {
  canCreateSchool,
  getCurrentSchool,
  getErrorMessage,
  isSystemAdmin,
  setCurrentSchool,
} from "../../utils/school";

function normalizeSchool(school, fallbackId) {
  return {
    id: school?.id || school?.school_id || fallbackId,
    name: school?.name || school?.school_name || "Сургууль",
    picture: school?.picture || school?.image || school?.thumbnail || "",
    description: school?.description || school?.about || school?.summary || "",
    priority: school?.priority ?? 0,
    courses: school?.courseCount ?? school?.courses ?? school?.total_courses ?? 0,
    users: school?.userCount ?? school?.users ?? school?.total_users ?? 0,
    teachers: school?.teacherCount ?? school?.teachers ?? 0,
    activeStudents:
      school?.studentCount ?? school?.students ?? school?.activeStudents ?? 0,
  };
}

function getEmailValue(user) {
  return (
    user?.email ||
    user?.user?.email ||
    user?.["{}user"]?.email ||
    ""
  );
}

function getUsernameValue(user) {
  return user?.username || user?.user?.username || "";
}

function getFullName(user) {
  const fullName = [user?.last_name, user?.first_name].filter(Boolean).join(" ").trim();
  return fullName || user?.name || "";
}

function getDisplayLabel(user) {
  return (
    getEmailValue(user) ||
    getUsernameValue(user) ||
    getFullName(user) ||
    `Хэрэглэгч #${user?.id || user?.user_id || "?"}`
  );
}

function getMetaLabel(user) {
  return (
    getEmailValue(user) ||
    getUsernameValue(user) ||
    getFullName(user) ||
    "И-мэйл алга"
  );
}

function parseRequestStatus(request) {
  const rawStatus = String(
    request?.status ||
      request?.status_name ||
      request?.["{}status"] ||
      request?.request_status ||
      ""
  )
    .trim()
    .toLowerCase();

  if (rawStatus.includes("approved") || rawStatus.includes("зөвш")) {
    return "approved";
  }

  if (Number(request?.status_id) === 2) {
    return "approved";
  }

  return rawStatus || "pending";
}

function parseRequestRole(request) {
  const rawRole = String(
    request?.role?.name || request?.role_name || request?.["{}role"] || ""
  )
    .trim()
    .toLowerCase();

  if (
    rawRole.includes("сургагч") ||
    rawRole.includes("teacher") ||
    rawRole.includes("багш")
  ) {
    return "teacher";
  }

  if (Number(request?.role_id) === 20) {
    return "teacher";
  }

  return rawRole || "member";
}

function parseRequestUser(request) {
  const rawUser = request?.user || request?.["{}user"];

  if (rawUser && typeof rawUser === "object") {
    return rawUser;
  }

  if (typeof rawUser === "string") {
    try {
      return JSON.parse(rawUser);
    } catch {
      return { name: rawUser };
    }
  }

  return null;
}

function parseTeacherRoleName(user) {
  return String(
    user?.school_role_name ||
      user?.role?.name ||
      user?.role_name ||
      user?.role ||
      user?.["{}role"] ||
      ""
  )
    .trim()
    .toLowerCase();
}

function isTeacherLike(user) {
  const roleName = parseTeacherRoleName(user);
  return (
    roleName.includes("teacher") ||
    roleName.includes("schoolteacher") ||
    roleName.includes("сургагч") ||
    roleName.includes("багш")
  );
}

async function enrichUsersWithEmail(users) {
  const enriched = await Promise.all(
    users.map(async (user) => {
      if (getEmailValue(user)) {
        return user;
      }

      const userId = user?.id || user?.user_id;
      if (!userId) {
        return user;
      }

      try {
        const payload = await getUserById(userId);
        return {
          ...payload,
          ...user,
          email: payload?.email || user?.email,
          username: payload?.username || user?.username,
          first_name: payload?.first_name || user?.first_name,
          last_name: payload?.last_name || user?.last_name,
        };
      } catch {
        return user;
      }
    })
  );

  return enriched;
}

function buildTeacherEntries(teachers, schoolUsers, requests) {
  const teacherEntries = teachers.map((teacher) => ({
    key: `teacher-${teacher?.id || teacher?.user_id}`,
    user_id: teacher?.id || teacher?.user_id,
    label: getDisplayLabel(teacher),
    meta: getMetaLabel(teacher),
    description: "",
    raw: teacher,
  }));

  const teacherIds = new Set(
    teacherEntries.map((entry) => Number(entry?.user_id)).filter(Boolean)
  );

  const roleBasedEntries = schoolUsers
    .filter(
      (user) =>
        isTeacherLike(user) &&
        !teacherIds.has(Number(user?.id || user?.user_id))
    )
    .map((user) => ({
      key: `role-${user?.id || user?.user_id}`,
      user_id: user?.id || user?.user_id,
      label: getDisplayLabel(user),
      meta: getMetaLabel(user),
      description: "",
      raw: user,
    }));

  const knownTeacherIds = new Set(
    [...teacherEntries, ...roleBasedEntries]
      .map((entry) => Number(entry?.user_id))
      .filter(Boolean)
  );

  const requestEntries = requests
    .filter(
      (request) =>
        parseRequestRole(request) === "teacher" &&
        parseRequestStatus(request) === "approved" &&
        !knownTeacherIds.has(Number(request?.user_id))
    )
    .map((request) => {
      const user = parseRequestUser(request) || request;

      return {
        key: `request-${request?.id}-${request?.user_id}`,
        user_id: request?.user_id,
        label: getDisplayLabel(user),
        meta: getMetaLabel(user),
        description: request?.description || "Хүсэлтээр багшийн эрх авсан хэрэглэгч.",
        raw: user,
      };
    });

  return [...teacherEntries, ...roleBasedEntries, ...requestEntries];
}

export default function SchoolDetailPage() {
  const { school_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const role = useTeam1Role();

  const fallbackSchool = useMemo(() => {
    const routeSchool = location.state?.school;
    if (routeSchool && Number(routeSchool.id) === Number(school_id)) {
      return normalizeSchool(routeSchool, school_id);
    }

    const storedSchool = getCurrentSchool();
    if (storedSchool && Number(storedSchool.id) === Number(school_id)) {
      return normalizeSchool(storedSchool, school_id);
    }

    return null;
  }, [location.state, school_id]);

  const [school, setSchool] = useState(fallbackSchool);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [teacherUsers, setTeacherUsers] = useState([]);
  const [teacherLoading, setTeacherLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    if (fallbackSchool) {
      setCurrentSchool(fallbackSchool);
    }

    getSchool(school_id)
      .then((payload) => {
        if (!alive) {
          return;
        }

        const nextSchool = normalizeSchool(payload || {}, school_id);
        setSchool(nextSchool);
        setCurrentSchool(nextSchool);
      })
      .catch((loadError) => {
        if (!alive) {
          return;
        }

        if (loadError?.response?.status === 401 && fallbackSchool) {
          setSchool(fallbackSchool);
          setError("");
          return;
        }

        setError(getErrorMessage(loadError, "Сургуулийн мэдээлэл олдсонгүй."));
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, [fallbackSchool, school_id]);

  useEffect(() => {
    let alive = true;

    if (!isSystemAdmin(role) || !school_id) {
      return undefined;
    }

    setTeacherLoading(true);

    Promise.all([
      getSchoolTeachers(school_id).catch(() => []),
      getSchoolUsersWithRoles(school_id).catch(() => []),
      getSchoolMembershipRequests(school_id).catch(() => []),
    ])
      .then(async ([teachers, schoolUsers, requests]) => {
        const [enrichedTeachers, enrichedSchoolUsers] = await Promise.all([
          enrichUsersWithEmail(teachers || []),
          enrichUsersWithEmail(schoolUsers || []),
        ]);
        const nextEntries = buildTeacherEntries(
          enrichedTeachers,
          enrichedSchoolUsers,
          requests || []
        );

        if (alive) {
          setTeacherUsers(nextEntries);
        }
      })
      .catch((loadError) => {
        if (alive) {
          setError(getErrorMessage(loadError, "Багш нарын мэдээллийг авч чадсангүй."));
        }
      })
      .finally(() => {
        if (alive) {
          setTeacherLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, [role, school_id]);

  const stats = useMemo(() => {
    if (!school) {
      return [];
    }

    return [
      { key: "courses", label: "Сургалтууд", value: school.courses },
      { key: "users", label: "Нийт хэрэглэгч", value: school.users },
      { key: "teachers", label: "Багш нар", value: school.teachers },
      { key: "students", label: "Сурагчид", value: school.activeStudents },
    ];
  }, [school]);

  const handleDeleteSchool = async () => {
    try {
      setError("");
      await deleteSchool(school_id);
      setCurrentSchool(null);
      navigate("/team1/schools");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Сургуулийг устгаж чадсангүй."));
    }
  };

  const handleSchoolAction = () => {
    navigate("/team1/schools/create");
  };

  const handleRestoreRole = async (teacher) => {
    try {
      setError("");
      setMessage("");

      const userId = teacher?.id || teacher?.user_id;
      await restoreSchoolUserRole(school_id, userId, "student");

      setTeacherUsers((prev) =>
        prev.filter((item) => Number(item?.user_id) !== Number(userId))
      );

      setMessage("Багшийн эрхийг буцааж суралцагч болголоо.");
    } catch (restoreError) {
      setError(getErrorMessage(restoreError, "Эрх буцааж чадсангүй."));
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
        Сургуулийн мэдээлэл ачаалж байна...
      </div>
    );
  }

  if (error && !school) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-sm font-medium text-rose-600 shadow-sm">
        {error}
      </div>
    );
  }

  if (!school) {
    return (
      <div className="rounded-[2rem] bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
        Сургууль олдсонгүй.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SchoolHeader
        school={school}
        canEdit={canCreateSchool(role)}
        canDelete={canCreateSchool(role)}
        onDelete={handleDeleteSchool}
        onReport={() => navigate("/team1/report")}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate("/team1/courses")}
          className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Энэ сургуулийн хичээлүүд
        </button>

        <button
          type="button"
          onClick={handleSchoolAction}
          className="rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-600"
        >
          {canCreateSchool(role) ? "+ Сургууль нэмэх" : "Сургуулийн админ хүсэх"}
        </button>
      </div>

      {message ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-600">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-rose-600">{error}</div>
      ) : null}

      <SchoolStats stats={stats} />

      {isSystemAdmin(role) ? (
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">Багшийн эрхтэй хэрэглэгчид</h2>
            <p className="mt-1 text-sm text-slate-500">
              Энэ сургуульд багшийн эрхтэй хэрэглэгчдийн жагсаалт
            </p>
          </div>

          {teacherLoading ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Багш нарын мэдээлэл ачаалж байна...
            </div>
          ) : teacherUsers.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Одоогоор багшийн эрхтэй хэрэглэгч алга.
            </div>
          ) : (
            <div className="space-y-3">
              {teacherUsers.map((teacher) => (
                <div
                  key={teacher.key}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-4"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{teacher.label}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {teacher.meta || "И-мэйл алга"}
                    </div>
                    {teacher.description ? (
                      <div className="mt-1 text-xs text-slate-400">{teacher.description}</div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestoreRole(teacher.raw)}
                    className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                  >
                    Эрх буцаах
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
