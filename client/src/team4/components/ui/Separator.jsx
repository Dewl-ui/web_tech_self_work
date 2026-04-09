export function Separator({ orientation = "horizontal", className = "", ...props }) {
  return orientation === "vertical"
    ? <div className={`w-px self-stretch bg-zinc-200 ${className}`} {...props} />
    : <div className={`h-px w-full bg-zinc-200 ${className}`} {...props} />;
}
