export default function Compose({
  open,
  lessonName = "",
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      style={{ animation: "lessonConfirmFade 140ms ease-out" }}
    >
      <style>
        {`
          @keyframes lessonConfirmFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes lessonConfirmPop {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-delete-title"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl"
        style={{ animation: "lessonConfirmPop 160ms ease-out" }}
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
