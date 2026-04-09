export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm
        focus:outline-none focus:ring-2 focus:ring-zinc-900
        disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
