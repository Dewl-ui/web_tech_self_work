import { useEffect, useState } from "react";
import useTeam1Role from "../../hooks/useTeam1Role";
import { approveRequest, getRequests, rejectRequest } from "../../services/requestService";
import {
  getErrorMessage,
  isSystemAdmin,
} from "../../utils/school";

export default function RequestsPage() {
  const role = useTeam1Role();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRequests()
      .then((items) => setRequests(items))
      .catch((loadError) =>
        setError(getErrorMessage(loadError, "Хүсэлтүүдийг ачаалж чадсангүй."))
      )
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      setRequests((prev) =>
        prev.map((item) =>
          Number(item.id) === Number(id) ? { ...item, status: "approved" } : item
        )
      );
    } catch (approveError) {
      setError(getErrorMessage(approveError, "Баталж чадсангүй."));
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      setRequests((prev) =>
        prev.map((item) =>
          Number(item.id) === Number(id) ? { ...item, status: "rejected" } : item
        )
      );
    } catch (rejectError) {
      setError(getErrorMessage(rejectError, "Татгалзаж чадсангүй."));
    }
  };

  if (!isSystemAdmin(role)) {
    return <div className="rounded-xl bg-yellow-100 p-4">Permission denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Requests</h1>
        <p className="mt-2 text-slate-500">System admin approval queue</p>
      </div>

      {error ? <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div> : null}

      {loading ? (
        <div className="rounded-xl bg-white p-6 shadow-sm">Ачаалж байна...</div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div className="grid grid-cols-[120px_1fr_120px_220px] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span>ID</span>
            <span>Type</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {requests.map((request) => (
            <div
              key={request.id}
              className="grid grid-cols-[120px_1fr_120px_220px] gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
            >
              <span>{request.id}</span>
              <span>{request.type}</span>
              <span>{request.status || "pending"}</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleApprove(request.id)}
                  className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(request.id)}
                  className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
