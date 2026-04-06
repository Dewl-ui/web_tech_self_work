import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "./utils/AuthContext";
import { parseField } from "./utils/api";
import SideMenu from "./components/sidebar/SideMenu";

export default function Layout() {
  const { user, school, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/team4/login", { replace: true });
  }

  const roleLabel = parseField(school, "role")?.name ?? null;

  return (
    <div className="flex min-h-screen bg-zinc-50">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:shrink-0 border-r border-zinc-200">
        <SideMenu onClose={() => {}} />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sideOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSideOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 flex flex-col border-r border-zinc-200
          transform transition-transform duration-200 ease-in-out md:hidden
          ${sideOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SideMenu onClose={() => setSideOpen(false)} />
      </aside>

      {/* ── Main content area ── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-6">

          {/* Left: hamburger (mobile) + school name + role badge */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSideOpen(true)}
              className="md:hidden p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
              aria-label="Цэс нээх"
            >
              <FiMenu className="h-5 w-5 text-zinc-600" />
            </button>

            {school?.name ? (
              <Link
                to="/team4/schools/current"
                className="text-sm font-semibold text-zinc-800 hover:text-zinc-600 transition-colors"
                title="Сургууль солих"
              >
                {school.name}
              </Link>
            ) : (
              <Link
                to="/team4/schools/current"
                className="text-sm text-zinc-400 hover:text-zinc-700"
              >
                Сургууль сонгоогүй
              </Link>
            )}

            {roleLabel && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 capitalize">
                {roleLabel}
              </span>
            )}
          </div>

          {/* Right: user name + logout */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden text-sm text-zinc-500 sm:block">
                {[user.last_name, user.first_name].filter(Boolean).join(" ") || user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium
                text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Гарах
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
