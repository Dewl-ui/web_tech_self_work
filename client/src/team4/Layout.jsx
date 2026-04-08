import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { useAuth } from "./utils/AuthContext";
import { parseField } from "./utils/api";
import SideMenu from "./components/sidebar/SideMenu";
import { Avatar } from "./components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./components/ui/DropdownMenu";
import { Separator } from "./components/ui/Separator";

export default function Layout() {
  const { user, school, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/team4/login", { replace: true });
  }

  const roleLabel = parseField(school, "role")?.name ?? null;
  const userName = [user?.last_name, user?.first_name].filter((v) => v && v !== "-").join(" ") || user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div
      className="fixed left-0 right-0 bottom-0 flex overflow-hidden bg-zinc-100 z-20"
      style={{ top: "4rem" }}
    >

      {/* ── Desktop sidebar (floating, fixed in place) ── */}
      {school && (
        <aside
          className={`hidden md:flex md:flex-col md:shrink-0 p-4 pr-0 transition-all duration-200 ease-in-out ${
            collapsed ? "md:w-[4.5rem]" : "md:w-64"
          }`}
        >
          <div className="flex flex-col h-full bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <SideMenu
              collapsed={collapsed}
              onToggle={() => setCollapsed((c) => !c)}
              onClose={() => {}}
            />
          </div>
        </aside>
      )}

      {/* ── Mobile sidebar overlay ── */}
      {school && sideOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSideOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      {school && (
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white shadow-xl
            transform transition-transform duration-200 ease-in-out md:hidden
            ${sideOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <SideMenu
            collapsed={false}
            onToggle={() => {}}
            onClose={() => setSideOpen(false)}
          />
        </aside>
      )}

      {/* ── Main content area (scrollable) ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">

        {/* Floating top navbar */}
        <header className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-4">
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm">

            {/* Left side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {school && (
                <button
                  onClick={() => setSideOpen(true)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                  aria-label="Цэс нээх"
                >
                  <FiMenu className="h-5 w-5 text-zinc-600" />
                </button>
              )}

              {/* <Separator orientation="vertical" className="hidden sm:block !h-7" /> */}

              {school?.name ? (
                <Link
                  to="/team4/schools/current"
                  className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-colors"
                  title="Сургууль солих"
                >
                  {school.name}
                </Link>
              ) : (
                <Link
                  to="/team4/schools/current"
                  className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  Сургууль сонгоогүй
                </Link>
              )}

              {roleLabel && (
                <span className="hidden sm:inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 capitalize">
                  {roleLabel}
                </span>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                {({ open, setOpen }) => (
                  <>
                    <DropdownMenuTrigger onClick={() => setOpen(!open)}>
                      <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-zinc-100 transition-colors cursor-pointer">
                        <Avatar
                          fallback={initials}
                          size="sm"
                          className="rounded-lg bg-zinc-100 text-zinc-700"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent open={open} className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-900">{userName}</span>
                          {user?.email && (
                            <span className="text-xs text-zinc-400 font-normal">{user.email}</span>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <FiLogOut className="h-4 w-4" />
                        Гарах
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </>
                )}
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
