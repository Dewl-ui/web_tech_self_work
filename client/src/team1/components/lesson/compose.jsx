export default function Compose({
  open,
  lessonName = "",
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-delete-title"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 id="lesson-delete-title" className="text-lg font-bold text-slate-900">
          Хичээл устгах
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Та "{lessonName || "энэ"}"- хичээлийг устгах гэж байна. Итгэлтэй байна уу?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Болих
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {loading ? "Устгаж байна..." : "Устгах"}
          </button>
        </div>
      </div>
    </div>
  );
}
