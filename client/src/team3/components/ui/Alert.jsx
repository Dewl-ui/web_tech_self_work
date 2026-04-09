export default function Alert({ children, tone = 'info', className = '' }) {
  const tones = {
    info: 'bg-sky-50 text-sky-900 border-sky-200',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    danger: 'bg-rose-50 text-rose-900 border-rose-200',
  };
  return <div className={`rounded-2xl border px-4 py-3 ${tones[tone] || tones.info} ${className}`}>{children}</div>;
}
