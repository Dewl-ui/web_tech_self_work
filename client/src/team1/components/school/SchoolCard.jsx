import { useNavigate } from "react-router-dom";

export default function SchoolCard({ school, onDelete, canDelete = false }) {
  const navigate = useNavigate();

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={school.picture || "https://picsum.photos/300"}
          alt={school.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-4 p-5">
        <h3 className="text-xl font-bold text-slate-900">{school.name}</h3>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-sm text-slate-500">
            Priority: <span className="font-semibold text-slate-700">{school.priority ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
            {canDelete ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete?.(school.id);
                }}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Устгах
              </button>
            ) : null}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/team1/schools/${school.id}`);
              }}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Дэлгэрэнгүй
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
