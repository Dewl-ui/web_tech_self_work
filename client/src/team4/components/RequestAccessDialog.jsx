import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiClock,
  FiFileText,
  FiSearch,
  FiSend,
  FiX,
} from "react-icons/fi";
import { FaSchool } from "react-icons/fa";
import { apiGet, apiPost, parseField, withCurrentUser } from "../utils/api";
import { ROLES } from "../utils/constants";
import { useToast } from "./ui/Toast";
import { useAuth } from "../utils/AuthContext";

function getSchoolId(school) {
  return (
    school?.id ?? school?.school_id ?? school?.SCHOOL_ID ?? school?.ID ?? null
  );
}

function getSchoolName(school) {
  return school?.name ?? `Сургууль #${getSchoolId(school) ?? "-"}`;
}

function getStatusLabel(item) {
  if (item?.status_id === 10) return "Хүлээгдэж байна";
  if (item?.status_id === 20) return "Зөвшөөрсөн";
  if (item?.status_id === 30) return "Татгалзсан";
  return item?.["{}status"] || `Төлөв #${item?.status_id ?? "-"}`;
}

function getRoleLabel(roleId, roleName) {
  if (roleName) return roleName;
  if (Number(roleId) === Number(ROLES.TEACHER)) return "Багш";
  if (Number(roleId) === Number(ROLES.STUDENT)) return "Суралцагч";
  if (Number(roleId) === Number(ROLES.ADMIN)) return "Админ";
  return `Эрх #${roleId ?? "-"}`;
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMembershipRole(userSchools, schoolId) {
  const matched = (userSchools || []).find(
    (s) => String(getSchoolId(s)) === String(schoolId),
  );

  if (!matched) return null;
  return parseField(matched, "role");
}

function isAdminOfSchool(userSchools, schoolId) {
  const role = getMembershipRole(userSchools, schoolId);
  return Number(role?.id) === Number(ROLES.ADMIN);
}

function countUsersByRole(users, schoolId) {
  let admins = 0;
  let teachers = 0;
  let students = 0;

  users.forEach((u) => {
    const matchedSchool = (u?.schools || []).find(
      (s) => String(getSchoolId(s)) === String(schoolId),
    );

    if (!matchedSchool) return;

    const roles =
      matchedSchool?.roles ?? parseField(matchedSchool, "roles") ?? [];
    const roleId = Array.isArray(roles) ? Number(roles?.[0]?.id) : null;

    if (roleId === ROLES.ADMIN) admins += 1;
    else if (roleId === ROLES.TEACHER) teachers += 1;
    else if (roleId === ROLES.STUDENT) students += 1;
  });

  return { admins, teachers, students };
}

function SchoolCardImage({ school }) {
  const [failed, setFailed] = useState(false);
  const picture = school?.picture;
  const schoolName = getSchoolName(school);
  const initial = schoolName?.charAt(0)?.toUpperCase?.() || "S";

  if (!picture || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-500">
        <div className="flex flex-col items-center justify-center gap-1">
          <FaSchool className="h-5 w-5" />
          <span className="text-xs font-semibold">{initial}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={picture}
      alt={schoolName}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function RequestAccessDialog({
  open,
  onClose,
  userSchools = [],
}) {
  const toast = useToast();
  const { user } = useAuth();

  const [allSchools, setAllSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(null);

  const [summaries, setSummaries] = useState({});
  const [loadingSummaryIds, setLoadingSummaryIds] = useState({});

  const [activeTab, setActiveTab] = useState("request");
  const [roleId, setRoleId] = useState(String(ROLES.STUDENT));
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);

  const selectedSchoolId = getSchoolId(selectedSchool);

  useEffect(() => {
    if (!open) return;
    if (allSchools.length > 0) return;

    setLoadingSchools(true);
    apiGet("/schools?limit=10000")
      .then((data) => {
        const items = data?.items ?? [];
        const filteredAndSorted = items
          .filter((s) => Number(getSchoolId(s)) !== 0)
          .sort((a, b) => Number(getSchoolId(a)) - Number(getSchoolId(b)));
        setAllSchools(filteredAndSorted);
      })
      .catch((err) => {
        toast.error(err.message || "Сургуулийн жагсаалт авахад алдаа гарлаа.");
      })
      .finally(() => setLoadingSchools(false));
  }, [open, allSchools.length, toast]);

  const filteredSchools = useMemo(() => {
    const q = search.trim().toLowerCase();

    const source = allSchools.filter((s) => Number(getSchoolId(s)) !== 0);

    if (!q) return source.slice(0, 10);

    return source
      .filter((school) => {
        const name = String(school?.name ?? "").toLowerCase();
        return name.includes(q);
      })
      .slice(0, 10);
  }, [allSchools, search]);

  const ensureSchoolSummary = useCallback(
    async (schoolId) => {
      if (!schoolId) return;
      if (summaries[schoolId]) return;
      if (loadingSummaryIds[schoolId]) return;

      setLoadingSummaryIds((prev) => ({ ...prev, [schoolId]: true }));

      try {
        const [usersRes, coursesRes] = await Promise.all([
          apiGet(`/schools/${schoolId}/users?limit=10000`),
          apiGet(`/schools/${schoolId}/courses?limit=10000`),
        ]);

        const users = usersRes?.items ?? [];
        const courses = coursesRes?.items ?? [];
        const roleCounts = countUsersByRole(users, schoolId);

        setSummaries((prev) => ({
          ...prev,
          [schoolId]: {
            admins: roleCounts.admins,
            teachers: roleCounts.teachers,
            students: roleCounts.students,
            courses: courses.length,
            error: false,
          },
        }));
      } catch {
        setSummaries((prev) => ({
          ...prev,
          [schoolId]: {
            admins: 0,
            teachers: 0,
            students: 0,
            courses: 0,
            error: true,
          },
        }));
      } finally {
        setLoadingSummaryIds((prev) => {
          const next = { ...prev };
          delete next[schoolId];
          return next;
        });
      }
    },
    [summaries, loadingSummaryIds],
  );

  useEffect(() => {
    if (!open) return;
    if (!selectedSchoolId) return;
    ensureSchoolSummary(selectedSchoolId);
  }, [open, selectedSchoolId, ensureSchoolSummary]);

  const loadMyRequests = useCallback(
    async (schoolId) => {
      if (!schoolId) return;

      setHistoryLoading(true);
      try {
        const data = await apiGet(`/schools/${schoolId}/requests`);
        const items = data?.items ?? [];
        const currentUserId = String(user?.id ?? "");

        const filtered = items.filter((item) => {
          const itemUserId = String(
            item?.user_id ??
              item?.created_by ??
              item?.user?.id ??
              item?.user?.user_id ??
              "",
          );
          return currentUserId && itemUserId === currentUserId;
        });

        const sorted = [...filtered].sort((a, b) => {
          const aTime = new Date(a?.created_on ?? 0).getTime();
          const bTime = new Date(b?.created_on ?? 0).getTime();
          return bTime - aTime;
        });

        setHistoryItems(sorted);
      } catch (err) {
        toast.error(err.message || "Өмнөх хүсэлтүүдийг авахад алдаа гарлаа.");
        setHistoryItems([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [toast, user?.id],
  );

  useEffect(() => {
    if (!open) return;
    if (activeTab !== "history") return;
    if (!selectedSchoolId) {
      setHistoryItems([]);
      return;
    }

    loadMyRequests(selectedSchoolId);
  }, [open, activeTab, selectedSchoolId, loadMyRequests]);

  function resetForm() {
    setSearch("");
    setSelectedSchool(null);
    setActiveTab("request");
    setRoleId(String(ROLES.STUDENT));
    setDescription("");
    setHistoryItems([]);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleBackToSearch() {
    setSelectedSchool(null);
    setActiveTab("request");
    setRoleId(String(ROLES.STUDENT));
    setDescription("");
    setHistoryItems([]);
  }

  function handleSelectSchool(school) {
    setSelectedSchool(school);
    setActiveTab("request");
    ensureSchoolSummary(getSchoolId(school));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedSchoolId) {
      toast.warning("Сургууль сонгоно уу.");
      return;
    }

    setSubmitting(true);
    try {
      await apiPost(
        `/schools/${selectedSchoolId}/requests`,
        withCurrentUser({
          description: description.trim(),
          role_id: roleId,
        }),
      );

      toast.success("Эрхийн хүсэлт амжилттай илгээгдлээ.");
      setDescription("");
      setRoleId(String(ROLES.STUDENT));
      setActiveTab("history");
      await loadMyRequests(selectedSchoolId);
    } catch (err) {
      toast.error(err.message || "Эрхийн хүсэлт илгээхэд алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedSummary = summaries[selectedSchoolId] ?? null;
  const membershipRole = getMembershipRole(userSchools, selectedSchoolId);
  const isAdminForSelectedSchool =
    selectedSchoolId && isAdminOfSchool(userSchools, selectedSchoolId);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Эрхийн хүсэлт
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Эхлээд сургууль хайж сонгоод, дараа нь эрхийн хүсэлтээ илгээнэ.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {!selectedSchool ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Сургууль хайх
              </label>

              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Сургуулийн нэрээр хайх..."
                  className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {loadingSchools ? (
              <div className="grid gap-3 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-xl bg-zinc-100"
                  />
                ))}
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-500">
                Тохирох сургууль олдсонгүй.
              </div>
            ) : (
              <div className="max-h-[460px] overflow-y-auto pr-1">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs text-zinc-500">
                    {search.trim()
                      ? `${filteredSchools.length} сургууль олдлоо`
                      : "Сургууль сонгоно уу"}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {filteredSchools.map((school) => {
                    const schoolId = getSchoolId(school);
                    const roleObj = getMembershipRole(userSchools, schoolId);
                    const isMember = !!roleObj;

                    return (
                      <button
                        key={schoolId}
                        type="button"
                        disabled={isMember}
                        onClick={() => handleSelectSchool(school)}
                        className={`group rounded-2xl border border-zinc-200 bg-white p-4 text-left transition-all duration-200 ${
                          isMember
                            ? "opacity-50 cursor-not-allowed grayscale-[0.3] bg-zinc-900/10"
                            : "hover:border-zinc-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm">
                            <SchoolCardImage school={school} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="min-w-0">
                              <h3 className="text-[15px] font-semibold leading-5 text-zinc-900 transition-colors group-hover:text-zinc-700">
                                {getSchoolName(school)}
                              </h3>

                              <p className="mt-1 text-xs text-zinc-400">
                                ID: {schoolId}
                              </p>
                            </div>

                            {roleObj?.name && (
                              <span className="mt-2 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                                Таны эрх: {roleObj.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Хаах
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleBackToSearch}
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Сургууль дахин сонгох
                </button>

                {membershipRole?.name && (
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-700">
                    Таны одоогийн эрх: {membershipRole.name}
                  </span>
                )}
              </div>

              <div className="text-lg font-semibold text-zinc-900">
                {getSchoolName(selectedSchool)}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-white px-3 py-2">
                  <div className="text-xs text-zinc-500">Багш</div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {loadingSummaryIds[selectedSchoolId]
                      ? "..."
                      : (selectedSummary?.teachers ?? 0)}
                  </div>
                </div>
                <div className="rounded-lg bg-white px-3 py-2">
                  <div className="text-xs text-zinc-500">Оюутан</div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {loadingSummaryIds[selectedSchoolId]
                      ? "..."
                      : (selectedSummary?.students ?? 0)}
                  </div>
                </div>
                <div className="rounded-lg bg-white px-3 py-2">
                  <div className="text-xs text-zinc-500">Хичээл</div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {loadingSummaryIds[selectedSchoolId]
                      ? "..."
                      : (selectedSummary?.courses ?? 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-b border-zinc-200 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("request")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === "request"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                Хүсэлт илгээх
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === "history"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                Миний хүсэлтүүд
              </button>
            </div>

            {activeTab === "request" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Хүсэж буй эрх
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        String(roleId) === String(ROLES.TEACHER)
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="role_id"
                          value={ROLES.TEACHER}
                          checked={String(roleId) === String(ROLES.TEACHER)}
                          onChange={(e) => setRoleId(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-zinc-900">Багш</div>
                          <div className="mt-1 text-sm text-zinc-500">
                            Тухайн сургуульд багш эрх хүсэх
                          </div>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        String(roleId) === String(ROLES.STUDENT)
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="role_id"
                          value={ROLES.STUDENT}
                          checked={String(roleId) === String(ROLES.STUDENT)}
                          onChange={(e) => setRoleId(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-zinc-900">
                            Суралцагч
                          </div>
                          <div className="mt-1 text-sm text-zinc-500">
                            Тухайн сургуульд суралцагч эрх хүсэх
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Тайлбар
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Жишээ: Энэ сургуульд багш / суралцагч эрх хүсэж байна."
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>

                {isAdminForSelectedSchool && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    Та энэ сургуулийн админ тул өөрийн сургууль руу эрхийн
                    хүсэлт илгээх боломжгүй.
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !selectedSchoolId ||
                      isAdminForSelectedSchool
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiSend className="h-4 w-4" />
                    {submitting ? "Илгээж байна..." : "Эрхийн хүсэлт илгээх"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Хаах
                  </button>
                </div>
              </form>
            ) : historyLoading ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-500">
                Уншиж байна...
              </div>
            ) : historyItems.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-500">
                Энэ сургууль дээр таны өмнөх эрх хүсэлт олдсонгүй.
              </div>
            ) : (
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-zinc-200 p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-zinc-900">
                        {getRoleLabel(
                          item.role_id,
                          item?.role?.name || item?.["{}role"],
                        )}
                      </div>

                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {getStatusLabel(item)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-zinc-600">
                      <div className="flex items-center gap-2">
                        <FiClock className="h-4 w-4 text-zinc-400" />
                        <span>
                          Илгээсэн огноо: {formatDate(item.created_on)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiFileText className="h-4 w-4 text-zinc-400" />
                        <span>
                          Сургууль:{" "}
                          {allSchools.find(
                            (s) =>
                              String(getSchoolId(s)) === String(item.school_id),
                          )?.name ?? `Сургууль #${item.school_id}`}
                        </span>
                      </div>

                      <div className="rounded-lg bg-zinc-50 px-3 py-2 text-zinc-700">
                        {item.description?.trim() || "Тайлбар оруулаагүй"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
