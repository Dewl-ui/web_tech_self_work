import { NavLink } from "react-router-dom";
import {
  FaBook,
  FaCalendarAlt,
  FaClipboardList,
  FaHome,
  FaUserCheck,
  FaUserClock,
  FaUserGraduate,
} from "react-icons/fa";

export default function SideMenu({ role = "student", currentPath = "" }) {
  const prefix = `/team3/${role}`;

  const studentItems = [
    { to: `${prefix}`, label: "Нүүр", icon: FaHome, end: true },
    { to: `${prefix}/grades`, label: "Дүнгийн мэдээлэл", icon: FaBook },
    { to: `${prefix}/attendance`, label: "Ирц бүртгэл", icon: FaUserCheck },
    { to: `${prefix}/calendar`, label: "Хуанли", icon: FaCalendarAlt },
    { to: `${prefix}/leave`, label: "Чөлөө авах", icon: FaClipboardList },
    { to: `${prefix}/act`, label: "Акт илгээх", icon: FaUserClock },
    { to: `${prefix}/settings`, label: "Тохиргоо", icon: FaUserGraduate },
  ];

  const teacherItems = [
    { to: `${prefix}`, label: "Нүүр", icon: FaHome, end: true },
    { to: `${prefix}/grades`, label: "Дүнгийн мэдээлэл", icon: FaBook },
    { to: `${prefix}/attendance`, label: "Ирц бүртгэл", icon: FaUserCheck },
    { to: `${prefix}/journal`, label: "Журнал", icon: FaClipboardList },
    { to: `${prefix}/requests`, label: "Чөлөөний хүсэлт", icon: FaUserClock },
    { to: `${prefix}/settings`, label: "Тохиргоо", icon: FaUserGraduate },
  ];

  const items = role === "teacher" ? teacherItems : studentItems;

  return (
    <aside className="hidden w-[270px] flex-col bg-[linear-gradient(180deg,#1f2747_0%,#232946_45%,#151a30_100%)] text-white md:flex">
      <div className="border-b border-white/10 p-6 pb-5">
        <div className="rounded-2xl bg-white px-3 py-3 text-center text-[10px] font-bold leading-tight text-[#1f4a9c] shadow-lg shadow-[#0f172a]/20">
          МОНГОЛ УЛСЫН ШИНЖЛЭХ УХААН
          <br />
          ТЕХНОЛОГИЙН ИХ СУРГУУЛЬ
        </div>
        <div className="mt-4 rounded-2xl bg-white/5 px-4 py-3 text-xs text-slate-200 ring-1 ring-white/10">
          <div className="font-semibold text-white">Team 3</div>
          
        </div>
      </div>

      <nav className="px-3 py-4">
        {items.map(({ to, label, icon: Icon, end }) => {
          // Зассан логик: Хэрэв "end: true" бол яг таарч байх ёстой.
          // Бусад тохиолдолд (дэд замууд) startsWith ашиглана.
          const active = end ? currentPath === to : currentPath.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              className={`group mb-2 flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm transition-all duration-200 ${
                active
                  ? "bg-[linear-gradient(90deg,rgba(99,102,241,0.95),rgba(56,189,248,0.88))] text-white shadow-lg shadow-indigo-950/30"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  active ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
                }`}
              >
                <Icon className="text-sm" />
              </span>
              <span>{label}</span>
              <span className="ml-auto opacity-70">⋮</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto p-5 text-xs text-slate-400">© 2026 Team 3</div>
    </aside>
  );
}
