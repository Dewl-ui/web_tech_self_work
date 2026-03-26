import { Link, useLocation } from 'react-router-dom';

export default function SideMenu() {
  const location = useLocation();

  const menus = [
    { name: 'Сургууль', path: '/team1' },
    { name: 'Сургалт', path: '/team1/courses' },
    { name: 'Ангилал', path: '/team1/categories' },
  ];

  return (
    <header className="bg-indigo-500 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl">E-LEARNING</div>

        <nav className="flex items-center gap-4">
          {menus.map((menu) => {
            const active =
              location.pathname === menu.path ||
              location.pathname.startsWith(menu.path + '/');

            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`px-4 py-2 rounded-lg font-medium ${
                  active ? 'bg-white text-indigo-600' : 'text-white'
                }`}
              >
                {menu.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <span>🔔</span>
          <span>💬</span>
          <span>Хэрэглэгч</span>
          <span>👤</span>
        </div>
      </div>
    </header>
  );
}