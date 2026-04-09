const variants = {
  default: "bg-zinc-900 text-white",
  secondary: "bg-zinc-100 text-zinc-800",
  outline: "border border-zinc-200 text-zinc-700 bg-transparent",
  destructive: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
};

export function Badge({ variant = "default", className = "", children, ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
