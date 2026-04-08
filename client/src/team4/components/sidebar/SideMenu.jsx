import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome, FiUsers, FiShield, FiBookOpen,
  FiUser, FiCalendar, FiChevronsLeft, FiChevronsRight,
} from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { parseField } from "../../utils/api";
import { ROLES } from "../../utils/constants";

const { ADMIN, TEACHER, STUDENT } = ROLES;

const systemNavItems = [
  {
    to: "/team4",
    label: "Нүүр хуудас",
    icon: FiHome,
    roles: [ADMIN, TEACHER, STUDENT],
    isHome: true,
  },
];

const schoolNavItems = [
  {
    to: "/team4/admin",
    label: "Админ самбар",
    icon: FiShield,
    roles: [ADMIN],
  },
  {
    to: "/team4/teacher",
    label: "Багшийн самбар",
    icon: FiBookOpen,
    roles: [TEACHER],
  },
];

const manageNavItems = [
  {
    to: "/team4/student",
    label: "Сургалтууд",
    icon: FiBookOpen,
    end: true,
    roles: [STUDENT],
  },
  {
    to: "/team4/student/groups",
    label: "Баг",
    icon: FiUsers,
    roles: [STUDENT],
  },
  {
    to: "/team4/student/calendar",
    label: "Хуанли",
    icon: FiCalendar,
    roles: [STUDENT],
  },
  {
    to: "/team4/users",
    label: "Хэрэглэгчид",
    icon: FiUsers,
    roles: [ADMIN],
  },
  {
    to: "/team4/roles",
    label: "Эрхийн удирдлага",
    icon: FiShield,
    roles: [ADMIN],
  },
];

const bottomNavItems = [
  {
    to: "/team4/schools/current",
    label: "Сургууль сонгох",
    icon: FiBookOpen,
    roles: [ADMIN, TEACHER],
  },
  {
    to: "/team4/profile",
    label: "Профайл",
    icon: FiUser,
    roles: [ADMIN, TEACHER, STUDENT],
  },
];

function filterItems(items, role) {
  return items.filter((item) =>
    role ? item.roles.includes(role) : item.to === "/team4/schools/current" || item.to === "/team4/profile"
  );
}

export default function SideMenu({ collapsed, onToggle, onClose }) {
  const { user, role, school } = useAuth();
  const roleLabel = parseField(school, "role")?.name ?? null;

  const systemVisible = filterItems(systemNavItems, role);
  const schoolVisible = filterItems(schoolNavItems, role);
  const manageVisible = filterItems(manageNavItems, role);
  const bottomVisible = filterItems(bottomNavItems, role);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center h-14 shrink-0 ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
        {!collapsed && (
          <span className="font-bold text-zinc-900 tracking-tight text-lg">Баг 4</span>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Дэлгэх"
          >
            <FiChevronsRight className="h-4 w-4" />
          </button>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Хураах"
          >
            <FiChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {/* System section */}
        {systemVisible.length > 0 && (
          <div className="space-y-0.5">
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Систем
              </p>
            )}
            {systemVisible.map((item) => (
              <SideNavLink key={`${item.to}-${item.label}`} item={item} collapsed={collapsed} onClose={onClose} />
            ))}
          </div>
        )}

        {/* School section */}
        {schoolVisible.length > 0 && (
          <div className="space-y-0.5 pt-3">
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Сургууль
              </p>
            )}
            {collapsed && <div className="mx-auto my-2 h-px w-4 bg-zinc-200" />}
            {schoolVisible.map((item) => (
              <SideNavLink key={`${item.to}-${item.label}`} item={item} collapsed={collapsed} onClose={onClose} />
            ))}
          </div>
        )}

        {/* Manage section */}
        {manageVisible.length > 0 && (
          <div className="space-y-0.5 pt-3">
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Удирдлага
              </p>
            )}
            {collapsed && <div className="mx-auto my-2 h-px w-4 bg-zinc-200" />}
            {manageVisible.map((item) => (
              <SideNavLink key={`${item.to}-${item.label}`} item={item} collapsed={collapsed} onClose={onClose} />
            ))}
          </div>
        )}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-2 space-y-0.5">
        {bottomVisible.map((item) => (
          <SideNavLink key={`${item.to}-${item.label}`} item={item} collapsed={collapsed} onClose={onClose} />
        ))}
      </div>

      {/* User footer */}
      {user && !collapsed && (
        <div className="px-4 py-3 border-t border-zinc-100 shrink-0">
          <p className="text-[11px] text-zinc-400 uppercase tracking-wide mb-0.5">
            Нэвтэрсэн
          </p>
          <p className="text-sm font-medium text-zinc-800 truncate">
            {[user.last_name, user.first_name].filter((v) => v && v !== "-").join(" ") || user.email}
          </p>
          {roleLabel && (
            <p className="text-xs text-zinc-400 mt-0.5">{`Хандах эрх - ${roleLabel}`}</p>
          )}
        </div>
      )}

    </div>
  );
}

function SideNavLink({ item, collapsed, onClose }) {
  const { pathname } = useLocation();

  // For home link, manually check exact match since NavLink end doesn't work reliably in nested routes
  const isHomeActive = item.isHome && (pathname === "/team4" || pathname === "/team4/");

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => {
        const active = item.isHome ? isHomeActive : isActive;
        return `group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-colors
        ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"}
        ${active
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        }`;
      }}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}
