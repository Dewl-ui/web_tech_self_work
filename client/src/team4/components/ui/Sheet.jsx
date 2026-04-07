import { useEffect } from "react";

const positions = {
  right: "right-0 top-0 h-full w-80",
  left: "left-0 top-0 h-full w-80",
  top: "top-0 left-0 w-full",
  bottom: "bottom-0 left-0 w-full",
};

export function Sheet({ open, onClose, side = "right", children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose?.(); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`absolute bg-white shadow-xl ${positions[side] ?? positions.right}`}>
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({ className = "", children, ...props }) {
  return <div className={`flex flex-col gap-1.5 p-6 ${className}`} {...props}>{children}</div>;
}

export function SheetTitle({ className = "", children, ...props }) {
  return <h2 className={`text-lg font-semibold text-zinc-900 ${className}`} {...props}>{children}</h2>;
}

export function SheetContent({ className = "", children, ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>;
}
