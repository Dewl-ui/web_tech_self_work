import { useNavigate } from "react-router-dom";

function getImage(school) {
  return (
    school.picture ||
    school.image ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
  );
}

export default function SchoolHeader({
  school,
  canEdit = false,
  onReport,
}) {
  const navigate = useNavigate();

  return (
    <section className="grid gap-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.25fr_0.85fr]">
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            School Profile
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {school.name}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-500">
            {school.description ||
              "Энэ сургуульд хамаарах сургалтууд, хэрэглэгчид болон ерөнхий мэдээллийг нэг дороос харуулах хэсэг."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {canEdit ? (
            <button
              type="button"
              onClick={() => navigate(`/team1/schools/${school.id}/edit`)}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Edit
            </button>
          ) : null}
          <button
            type="button"
            onClick={onReport}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Report
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] bg-slate-100">
        <img src={getImage(school)} alt={school.name} className="h-full w-full object-cover" />
      </div>
    </section>
  );
}
