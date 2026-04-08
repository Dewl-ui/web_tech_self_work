import { useEffect, useState } from "react";
import useTeam1Role from "../../hooks/useTeam1Role";
import {
  approveRequest,
  getRequests,
  rejectRequest,
} from "../../services/requestService";
import { restoreSchoolUserRole } from "../../services/schoolUserService";
import { getErrorMessage, isSystemAdmin } from "../../utils/school";

function getRequestTypeLabel(request) {
  const type = String(request?.request_type || request?.type || "").toLowerCase();

  if (type === "school_admin") {
    return "Сургууль нэмэх хүсэлт";
  }

  if (type === "teacher") {
    return "Багш эрхийн хүсэлт";
  }

  return "Хүсэлт";
}

function getRequestStatusLabel(request) {
  const raw =
    request?.status ||
    request?.["{}status"] ||
    request?.status_name ||
    request?.status_id;
  const value = String(raw || "pending").toLowerCase();

  if (value === "approved" || value === "2") return "Зөвшөөрсөн";
  if (value === "rejected" || value === "3") return "Татгалзсан";
  return "Хүлээгдэж байна";
}

function isTeacherRequest(request) {
  return String(request?.request_type || "").toLowerCase() === "teacher";
}

function isApproved(request) {
  return request?.status === "approved" || Number(request?.status_id) === 2;
}

export default function RequestsPage() {
  const role = useTeam1Role();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getRequests()
      .then((items) => setRequests(items))
      .catch((loadError) =>
        setError(getErrorMessage(loadError, "Хүсэлтүүдийг ачаалж чадсангүй."))
      )
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (request) => {
    try {
      setError("");
      setSuccessMessage("");
      await approveRequest(request);
      setRequests((prev) =>
        prev.map((item) =>
          Number(item.id) === Number(request.id)
            ? { ...item, status: "approved", status_id: 2 }
            : item
        )
      );
      setSuccessMessage("Хүсэлтийг зөвшөөрлөө.");
    } catch (approveError) {
      setError(getErrorMessage(approveError, "Зөвшөөрч чадсангүй."));
    }
  };

  const handleReject = async (request) => {
    try {
      setError("");
      setSuccessMessage("");
      await rejectRequest(request, "Татгалзсан");
      setRequests((prev) =>
        prev.map((item) =>
          Number(item.id) === Number(request.id)
            ? { ...item, status: "rejected", status_id: 3 }
            : item
        )
      );
      setSuccessMessage("Хүсэлтийг татгалзлаа.");
    } catch (rejectError) {
      setError(getErrorMessage(rejectError, "Татгалзаж чадсангүй."));
    }
  };

  const handleRestoreRole = async (request) => {
    try {
      setError("");
      setSuccessMessage("");
      await restoreSchoolUserRole(request.school_id, request.user_id, "student");
      setRequests((prev) =>
        prev.map((item) =>
          Number(item.id) === Number(request.id)
            ? { ...item, role_restored: true }
            : item
        )
      );
      setSuccessMessage("Багшийн эрхийг буцааж, суралцагчийн эрх олголоо.");
    } catch (restoreError) {
      setError(getErrorMessage(restoreError, "Эрх буцааж чадсангүй."));
    }
  };

  if (!isSystemAdmin(role)) {
    return <div className="rounded-xl bg-yellow-100 p-4">Хандах эрхгүй.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Хүсэлтүүд</h1>
        <p className="mt-2 text-slate-500">
          Системийн админ батлах сургууль болон эрхийн хүсэлтүүд
        </p>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-600">
          {successMessage}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl bg-white p-6 shadow-sm">Ачаалж байна...</div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div className="grid grid-cols-[110px_1.5fr_1fr_300px] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span>Дугаар</span>
            <span>Төрөл</span>
            <span>Төлөв</span>
            <span>Үйлдэл</span>
          </div>

          {requests.map((request) => (
            <div
              key={request.id}
              className="grid grid-cols-[110px_1.5fr_1fr_300px] gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
            >
              <span>{request.id}</span>

              <div className="space-y-1">
                <div>{getRequestTypeLabel(request)}</div>
                {request.school_id ? (
                  <div className="text-xs text-slate-400">Сургууль: {request.school_id}</div>
                ) : null}
                {request.user_id ? (
                  <div className="text-xs text-slate-400">
                    Хэрэглэгч: {request.user_id}
                  </div>
                ) : null}
                {request.name ? (
                  <div className="text-xs text-slate-400">Нэр: {request.name}</div>
                ) : null}
                {request.description ? (
                  <div className="text-xs text-slate-400">Тайлбар: {request.description}</div>
                ) : null}
              </div>

              <span>{getRequestStatusLabel(request)}</span>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleApprove(request)}
                  className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white"
                >
                  Зөвшөөрөх
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(request)}
                  className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
                >
                  Татгалзах
                </button>
                {isTeacherRequest(request) && isApproved(request) ? (
                  <button
                    type="button"
                    onClick={() => handleRestoreRole(request)}
                    disabled={Boolean(request.role_restored)}
                    className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {request.role_restored ? "Эрх буцаасан" : "Эрх буцаах"}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
