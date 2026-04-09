import { useEffect, useState } from "react";
import { FiSend, FiX } from "react-icons/fi";
import { apiGet, apiPost, withCurrentUser } from "../utils/api";
import { ROLES } from "../utils/constants";
import { useToast } from "./ui/Toast";

export default function RequestAccessDialog({ open, onClose }) {
  const toast = useToast();

  const [allSchools, setAllSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [roleId, setRoleId] = useState(String(ROLES.STUDENT));
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  function handleClose() {
    setSelectedSchoolId("");
    setRoleId(String(ROLES.STUDENT));
    setDescription("");
    onClose();
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
      handleClose();
    } catch (err) {
      toast.error(err.message || "Эрхийн хүсэлт илгээхэд алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Эрхийн хүсэлт илгээх
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Сургууль сонгоод эрхийн хүсэлт илгээнэ үү.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
              placeholder="Жишээ: Энэ сургуульд суралцагчаар элсэх хүсэлт илгээж байна."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || loadingSchools || allSchools.length === 0}
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
      </div>
    </div>
  );
}