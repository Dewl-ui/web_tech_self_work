const variants = {
  default: "bg-zinc-900 text-white hover:bg-zinc-700",
  outline: "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900",
  ghost: "hover:bg-zinc-100 text-zinc-900",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  link: "text-zinc-900 underline-offset-4 hover:underline p-0 h-auto",
};

const sizes = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-10 px-6 text-base",
  icon: "h-9 w-9 p-0",
};

export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  loading = false,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant] ?? variants.default}
        ${sizes[size] ?? sizes.default}
        ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
