import { Link } from "react-router-dom";
import { FiEdit2, FiImage } from "react-icons/fi";

function RightPanel() {
  return (
    <div className="relative hidden flex-1 overflow-hidden lg:flex items-center justify-center bg-zinc-100">
      {/* Decorative concentric circles + crosshair lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[400, 300, 210, 130].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-zinc-300/70"
            style={{ width: size, height: size }}
          />
        ))}
        {/* Horizontal line */}
        <div className="absolute left-0 right-0 h-px bg-zinc-300/70" />
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 w-px bg-zinc-300/70" />
        {/* Diagonal lines */}
        <div
          className="absolute bg-zinc-300/50"
          style={{ width: 1, height: "140%", transform: "rotate(45deg)" }}
        />
        <div
          className="absolute bg-zinc-300/50"
          style={{ width: 1, height: "140%", transform: "rotate(-45deg)" }}
        />
      </div>
      {/* Center image placeholder icon */}
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-lg border border-zinc-300 bg-white shadow-sm">
        <FiImage className="h-6 w-6 text-zinc-400" />
      </div>
    </div>
  );
}

export function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — form area */}
      <div className="flex w-full flex-col lg:w-[460px] lg:shrink-0">
        {/* Logo */}
        <div className="p-8">
          <Link
            to="/team4/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900"
          >
            <FiEdit2 className="h-4 w-4" />
            Sicty
          </Link>
        </div>

        {/* Form content — vertically centered */}
        <div className="flex flex-1 items-center justify-center px-8 pb-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <RightPanel />
    </div>
  );
}
