export function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      className={`flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm
        placeholder:text-zinc-400
        focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}`}
      {...props}
    />
  );
}
