const variantClasses = {
  default: "border-zinc-200 bg-zinc-50 text-zinc-900",
  destructive: "border-red-200 bg-red-50 text-red-800",
  success: "border-green-200 bg-green-50 text-green-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
};

export function Alert({ variant = "default", className = "", children, ...props }) {
  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 text-sm ${variantClasses[variant] ?? variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ className = "", children, ...props }) {
  return (
    <h5 className={`mb-1 font-semibold leading-none ${className}`} {...props}>
      {children}
    </h5>
  );
}

export function AlertDescription({ className = "", children, ...props }) {
  return (
    <div className={`text-sm leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  );
}
