export function StatCard({ title, value, icon, description, className = "" }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">{value ?? "—"}</p>
          {description && <p className="mt-1 text-xs text-zinc-400">{description}</p>}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 text-xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
