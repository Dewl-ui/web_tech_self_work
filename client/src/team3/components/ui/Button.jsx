export function Button({ variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition';
  const variants = {
    primary: 'bg-[linear-gradient(135deg,#4f46e5,#0ea5e9)] text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5',
    secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:shadow-md',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };
  return <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>{children}</button>;
}
export default Button;
