export function Table({ children, className = '' }) {
  return <div className={`overflow-x-auto rounded-2xl border border-slate-200 bg-white ${className}`}><table className="min-w-full text-sm">{children}</table></div>;
}
export default Table;
