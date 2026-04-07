const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base" };

export function Avatar({ src, alt = "", fallback, size = "md", className = "" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover ${sizes[size] ?? sizes.md} ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-zinc-200 font-medium text-zinc-600 ${sizes[size] ?? sizes.md} ${className}`}
    >
      {fallback ?? alt?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}
