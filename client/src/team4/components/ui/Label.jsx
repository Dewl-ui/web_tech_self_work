export function Label({ className = "", children, ...props }) {
  return (
    <label
      className={`text-sm font-medium leading-none text-zinc-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
