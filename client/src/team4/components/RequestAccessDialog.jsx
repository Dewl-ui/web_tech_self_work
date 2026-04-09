import { useEffect, useState } from "react";
import { FiSend, FiX, FiClock, FiFileText } from "react-icons/fi";
import { apiGet, apiPost, withCurrentUser } from "../utils/api";
import { ROLES } from "../utils/constants";
import { useToast } from "./ui/Toast";
import { useAuth } from "../utils/AuthContext";

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

function isAdminOfSchool(userSchools, schoolId) {
  return userSchools.some((school) => {
    const role =
      school?.role ||
      (() => {
        try {
          return school?.["{}role"] ? JSON.parse(school["{}role"]) : null;
        } catch {
          return null;
        }
      })();

    const id =
      school?.id ?? school?.school_id ?? school?.ID ?? school?.SCHOOL_ID ?? "";

    return (
      String(id) === String(schoolId) &&
      Number(role?.id) === Number(ROLES.ADMIN)
    );
  });
}

export default function RequestAccessDialog({
  open,
  onClose,
  userSchools = [],
}) {
  const toast = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("request");

  const [allSchools, setAllSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [roleId, setRoleId] = useState(String(ROLES.STUDENT));
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    if (!open) return;
    if (allSchools.length > 0) return;

    setLoadingSchools(true);
    apiGet("/schools?limit=10000")
      .then((data) => {
        const items = data?.items ?? [];
        setAllSchools(items.filter((s) => s.id !== 0));
      })
      .catch((err) => {
        toast.error(err.message || "Сургуулийн жагсаалт авахад алдаа гарлаа.");
      })
      .finally(() => setLoadingSchools(false));
  }, [open, allSchools.length, toast]);

  useEffect(() => {
    if (!open) return;
    if (activeTab !== "history") return;
    if (!selectedSchoolId) {
      setHistoryItems([]);
      return;
    }

    loadMyRequests(selectedSchoolId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab, selectedSchoolId, user?.id]);

  function resetForm() {
    setActiveTab("request");
    setSelectedSchoolId("");
    setRoleId(String(ROLES.STUDENT));
    setDescription("");
    setHistoryItems([]);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function loadMyRequests(schoolId) {
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

  const isAdminForSelectedSchool =
    selectedSchoolId && isAdminOfSchool(userSchools, selectedSchoolId);

  const cannotSubmit =
    !selectedSchoolId ||
    loadingSchools ||
    allSchools.length === 0 ||
    isAdminForSelectedSchool;

  function getSchoolNameById(id) {
    const school = allSchools.find((s) => String(s.id) === String(id));
    return school?.name ?? `Сургууль #${id}`;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Эрхийн хүсэлт
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Нэг dialog дотроос хүсэлт илгээж, өмнөх хүсэлтүүдээ харна.
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

        <div className="mb-5 flex gap-2 border-b border-zinc-200 pb-3">
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

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Сургууль
          </label>
          <select
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            disabled={loadingSchools}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          >
            <option value="">
              {loadingSchools ? "Ачаалж байна..." : "-- Сургууль сонгох --"}
            </option>
            {allSchools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name ?? `Сургууль #${school.id}`}
              </option>
            ))}
          </select>
        </div>

        {activeTab === "request" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Хүсэж буй эрх
              </label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              >
                <option value={ROLES.TEACHER}>Багш</option>
                <option value={ROLES.STUDENT}>Суралцагч</option>
              </select>
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
                Та энэ сургуулийн админ тул өөрийн сургууль руу эрхийн хүсэлт
                илгээх боломжгүй.
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting || cannotSubmit}
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
        ) : !selectedSchoolId ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-500">
            Миний хүсэлтүүдийг харахын тулд сургууль сонгоно уу.
          </div>
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
                    <span>Илгээсэн огноо: {formatDate(item.created_on)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiFileText className="h-4 w-4 text-zinc-400" />
                    <span>Сургууль: {getSchoolNameById(item.school_id)}</span>
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
    </div>
  );
}