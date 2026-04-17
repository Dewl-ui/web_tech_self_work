export default function GradeTable({ title, rows, resolveName }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-zinc-700">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-400">Дүн бүртгэгдээгүй.</p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between py-2 text-sm">
              <span className="truncate text-zinc-700">{resolveName(row)}</span>
              <span className="font-semibold text-zinc-900">{row.grade_point ?? 0}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
