import { Link, useLocation } from "react-router-dom";

const SideMenu = () => {
  const { pathname } = useLocation();

  const menus = [
    { name: "Багш", path: "/team6/teacher" },
    { name: "Сурагч", path: "/team6/student" },
  ];

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r flex flex-col p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ExamMN</h1>
        <p className="text-sm text-gray-500">Team 6</p>
      </div>

      <nav className="space-y-2">
        {menus.map((item) => {
          const active =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideMenu;
