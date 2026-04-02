import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";
import SideMenu from "./components/sidebar/SideMenu";

const ROLE_LABELS = { admin: "Админ", teacher: "Багш", student: "Оюутан" };

/**
 * Authenticated layout shell.
 * SideMenu is Member 4's component (currently a null stub — swap in when ready).
 * Top bar provides school context, role badge and logout for all protected pages.
 */
export default function Layout() {
  const { user, school, role, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/team4/login", { replace: true });
  }

  const roleLabel = ROLE_LABELS[role] ?? role;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* SideMenu — Member 4 implements this */}
      <SideMenu />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6">
          {/* Left: school name + role badge */}
          <div className="flex items-center gap-2.5">
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

        {/* ── Page content ── */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
