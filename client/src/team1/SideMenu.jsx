import { Link, useLocation } from "react-router-dom";

export default function SideMenu() {
  const location = useLocation();

  const menuItems = [
    { label: "Сургууль", path: "/team1" },
    { label: "Сургалт", path: "/team1/courses" },
    { label: "Ангилал", path: "/team1/categories" },
  ];

  return (
    <header className="bg-indigo-500 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">E-LEARNING</div>

        <nav className="flex items-center gap-4">
          {menuItems.map((item) => {
            // "Сургууль" /team1 exact match, бусад нь startsWith
            const active =
              item.path === "/team1"
                ? location.pathname === "/team1" || location.pathname === "/team1/"
                : location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/");

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  active
                    ? "bg-white text-indigo-600"
                    : "text-white hover:bg-indigo-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <span>🔔</span>
          <span>💬</span>
          <span>Хэрэглэгч</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            👤
          </div>
        </div>
      </div>
    </header>
  );
}