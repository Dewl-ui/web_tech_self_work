export default function Card({ children, className = '' }) {
  return <section className={`rounded-[24px] border border-white/70 bg-white/78 p-5 shadow-[0_18px_50px_rgba(148,163,184,0.18)] backdrop-blur ${className}`}>{children}</section>;
}
