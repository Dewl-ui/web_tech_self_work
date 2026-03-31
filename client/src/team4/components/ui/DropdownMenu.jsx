import { useEffect, useRef, useState } from "react";

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      {typeof children === "function" ? children({ open, setOpen }) : children}
    </div>
  );
}

export function DropdownMenuTrigger({ children, onClick, ...props }) {
  return <div onClick={onClick} {...props}>{children}</div>;
}

export function DropdownMenuContent({ open, className = "", children, ...props }) {
  if (!open) return null;
  return (
    <div
      className={`absolute right-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ className = "", children, onClick, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className = "" }) {
  return <div className={`my-1 h-px bg-zinc-100 ${className}`} />;
}

export function DropdownMenuLabel({ className = "", children, ...props }) {
  return <div className={`px-3 py-1.5 text-xs font-medium text-zinc-500 ${className}`} {...props}>{children}</div>;
}
