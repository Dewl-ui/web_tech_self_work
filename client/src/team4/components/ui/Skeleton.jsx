export function Skeleton({ className = "", ...props }) {
  return <div className={`animate-pulse rounded-md bg-zinc-200 ${className}`} {...props} />;
}
