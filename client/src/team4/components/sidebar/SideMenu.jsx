import { NavLink } from "react-router-dom";
import {
  FiHome, FiUsers, FiShield, FiBookOpen,
  FiUser, FiLock, FiX,
  FiCalendar,
} from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";

const navItems = [
  {
    to: "/team4",
    label: "Нүүр хуудас",
    icon: FiHome,
    end: true,
    roles: ["admin", "teacher", "student"],
  },
  // ── Role dashboards (Member A / B / C add their pages in pages/{role}/) ──
  {
    to: "/team4/admin",
    label: "Админ самбар",
    icon: FiShield,
    roles: ["admin"],
  },
  {
    to: "/team4/teacher",
    label: "Багшийн самбар",
    icon: FiBookOpen,
    roles: ["teacher"],
  },
  {
    to: "/team4/student",
    label: "Сургалтууд",  
    icon: FiBookOpen,
    end: true,
    roles: ["student"],
  },
  {
    to: "/team4/student/groups",
    label: "Баг",
    icon: FiUsers,
    roles: ["student"],
  },
  {
    to: "/team4/student/calendar",
    label: "Хуанли",
    icon: FiCalendar,
    roles: ["student"],
  },
  // ── Shared admin tools ──
  {
    to: "/team4/users",
    label: "Хэрэглэгчид",
    icon: FiUsers,
    roles: ["admin"],
  },
  {
    to: "/team4/roles",
    label: "Эрхийн удирдлага",
    icon: FiShield,
    roles: ["admin"],
  },
  {
    to: "/team4/schools/current",
    label: "Сургууль сонгох",
    icon: FiBookOpen,
    roles: ["admin", "teacher"],
  },
  // ── Personal ──
  {
    to: "/team4/profile",
    label: "Профайл",
    icon: FiUser,
    roles: ["admin", "teacher", "student"],
  },
];

const ROLE_LABELS = {
  admin:   "Админ",
  teacher: "Багш",
  student: "Оюутан",
  user:    "Хэрэглэгч",
};

export default function SideMenu({ onClose }) {
  const { user, role } = useAuth();

  const visible = navItems.filter(
    (item) => !role || item.roles.includes(role)
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-zinc-200 shrink-0">
        <span className="font-bold text-zinc-900 tracking-tight">Баг 4</span>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-md hover:bg-zinc-100 cursor-pointer transition-colors"
          aria-label="Хаах"
        >
          <FiX className="h-4 w-4 text-zinc-500" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {visible.map((item) => (
          <NavLink
            key={`${item.to}-${item.label}`}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logged-in user footer */}
      {user && (
        <div className="px-4 py-3 border-t border-zinc-200 shrink-0">
          <p className="text-[11px] text-zinc-400 uppercase tracking-wide mb-0.5">
            Нэвтэрсэн хэрэглэгч
          </p>
          <p className="text-sm font-medium text-zinc-800 truncate">
            {`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email}
          </p>
          {role && (
            <p className="text-xs text-zinc-400 mt-0.5">
              {ROLE_LABELS[role] ?? role}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
