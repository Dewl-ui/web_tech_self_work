const DEFAULT_STATS = [
  { key: "schools", label: "Нийт сургууль", value: 0 },
  { key: "courses", label: "Сургалтууд", value: 0 },
  { key: "users", label: "Хэрэглэгчид", value: 0 },
  { key: "teachers", label: "Багш нар", value: 0 },
];

export default function SchoolStats({ stats = DEFAULT_STATS }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stat.value}
          </p>
          {stat.helper ? (
            <p className="mt-2 text-xs font-medium text-sky-600">{stat.helper}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
