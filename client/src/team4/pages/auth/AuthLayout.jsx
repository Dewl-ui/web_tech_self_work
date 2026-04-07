import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

const slides = [
  "/team4/auth_images/school2.jpg",
  "/team4/auth_images/school3.jpg",
  "/team4/auth_images/school4.jpg",
  "/team4/auth_images/school5.jpg",
  "/team4/auth_images/school1.jpg",
];

function RightPanel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden min-h-0 min-w-0 overflow-hidden lg:block lg:min-h-screen lg:w-1/2">
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover select-none transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          draggable="false"
        />
      ))}
    </div>
  );
}

export function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen -mx-4 -my-6 sm:-m-6 md:-my-10 md:-mx-8">
      {/* Left panel — form area */}
      <div className="flex w-full min-w-0 flex-col lg:w-1/2 lg:min-h-screen">
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
