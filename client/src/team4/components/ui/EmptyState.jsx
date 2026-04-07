export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 text-2xl">
          {icon}
        </div>
      )}
      {title && <h3 className="mb-1 text-base font-semibold text-zinc-800">{title}</h3>}
      {description && <p className="mb-4 max-w-sm text-sm text-zinc-500">{description}</p>}
      {action}
    </div>
  );
}
