import { Link, useLocation, useNavigate } from "react-router-dom";
import useTeam1Role from "./hooks/useTeam1Role";
import useTeam1User from "./hooks/useTeam1User";
import { getRoleLabel } from "./utils/school";

export default function SideMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = useTeam1Role();
  const user = useTeam1User();
  const displayName = user?.name || user?.username || "Хэрэглэгч";
  const roleLabel = getRoleLabel(user?.role || role);
  const avatarLabel = String(displayName || "U").trim().charAt(0).toUpperCase();

  const menuItems = [
    { label: "Сургууль", path: "/team1/schools" },
    { label: "Сургалт", path: "/team1/courses" },
    { label: "Ангилал", path: "/team1/categories" },
  ];

  const handleLogout = () => {
    [
      "access_token",
      "refresh_token",
      "role",
      "team1_user",
      "selectedSchool",
      "school",
      "currentCourse",
    ].forEach((key) => localStorage.removeItem(key));

    window.dispatchEvent(new CustomEvent("team1-role-change", { detail: "student" }));
    window.dispatchEvent(new CustomEvent("team1-user-change", { detail: null }));
    navigate("/");
  };

  return (
    <header className="bg-indigo-500 text-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-lg font-bold">E-LEARNING</div>

        <nav className="flex items-center gap-4">
          {menuItems.map((item) => {
            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-white text-indigo-600" : "text-white hover:bg-indigo-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <div className="text-right leading-tight">
            <div className="font-medium text-white">{displayName}</div>
            <div className="text-xs text-white/70">{roleLabel}</div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            {avatarLabel || "U"}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Гарах
          </button>
        </div>
      </div>
    </header>
  );
}
