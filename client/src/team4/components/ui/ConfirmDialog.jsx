import { Button } from "./Button";

export function ConfirmDialog({
  open,
  title = "Та устгахдаа итгэлтэй байна уу?",
  description = "Энэ үйлдлийг буцаах боломжгүй.",
  confirmText = "Үргэлжлүүлэх",
  cancelText = "Цуцлах",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Устгаж байна..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}