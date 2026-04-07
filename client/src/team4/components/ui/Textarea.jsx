export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm
        placeholder:text-zinc-400
        focus:outline-none focus:ring-2 focus:ring-zinc-900
        disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
