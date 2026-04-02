import { Link, useLocation } from "react-router-dom";

export default function SideMenu() {
  const location = useLocation();

  const menuItems = [
    { label: "Сургууль", path: "/team1/schools" },
    { label: "Сургалт", path: "/team1/courses" },
    { label: "Ангилал", path: "/team1/categories" },
  ];

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
          <span>Хэрэглэгч</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
