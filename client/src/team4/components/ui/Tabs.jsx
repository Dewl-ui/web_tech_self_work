import { createContext, useContext, useState } from "react";

const TabsCtx = createContext(null);

export function Tabs({ defaultValue, value: ctrl, onValueChange, children, className = "" }) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const value = ctrl ?? internal;
  function onChange(v) { setInternal(v); onValueChange?.(v); }
  return (
    <TabsCtx.Provider value={{ value, onChange }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className = "", children, ...props }) {
  return (
    <div className={`inline-flex h-9 items-center rounded-lg bg-zinc-100 p-1 text-zinc-500 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className = "", children, ...props }) {
  const { value: active, onChange } = useContext(TabsCtx);
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all
        ${active === value ? "bg-white text-zinc-900 shadow" : "hover:text-zinc-700"}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className = "", children, ...props }) {
  const { value: active } = useContext(TabsCtx);
  if (active !== value) return null;
  return <div className={`mt-2 ${className}`} {...props}>{children}</div>;
}
