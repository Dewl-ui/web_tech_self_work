import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const base = "/team5";

  const menuItems = [
    { name: "Хяналтын самбар", path: `${base}/dashboard`, icon: "📊", section: "main" },
    { name: "Хичээлүүд", path: `${base}/home`, icon: "📚", badge: { text: "8", color: "green" }, section: "main" },
    { name: "Асуултын төрөл", path: `${base}/courses/1/questions/types`, icon: "🏷️", section: "questions" },
    { name: "Асуултын түвшин", path: `${base}/courses/1/questions/levels`, icon: "📶", section: "questions" },
    { name: "Асуулт жагсаалт", path: `${base}/courses/1/questions`, icon: "📋", badge: { text: "82", color: "amber" }, section: "questions" },
    { name: "Асуултын оноо", path: `${base}/courses/1/questions/points`, icon: "⭐", section: "questions" },
    { name: "Тайлан / Статистик", path: `${base}/courses/1/questions/report`, icon: "📈", section: "reports" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">

{/* SIDEBAR */}
<aside className="w-[220px] bg-white border-r border-[#E2E5EF] flex flex-col sticky top-0 h-screen flex-shrink-0 z-40">
{/* Brand */}
        <div className="h-[75px] border-b border-[#E2E5EF] flex items-center px-4 gap-3 flex-shrink-0">
          <div className="w-8 h-8 bg-[#3B6FF5] rounded-lg flex items-center justify-center text-base flex-shrink-0">🎓</div>
          <div>
            <h2 className="text-[11.5px] font-extrabold text-[#1A1D2E] leading-tight">Их Сургуулийн Систем</h2>
            <p className="text-[9px] text-[#8A90AB] mt-0.5">Асуултын Удирдлага</p>
          </div>
        </div>

        {/* Current course pill — fixed, never shrinks */}
        <div className="mx-2.5 mt-2.5 mb-0 bg-[#EEF2FE] border border-[#C7D4FC] rounded-[10px] px-3 py-2 flex-shrink-0">
          <p className="text-[8.5px] font-bold tracking-[0.8px] uppercase text-[#3B6FF5]">Одоогийн хичээл</p>
          <p className="text-[11.5px] font-extrabold text-[#1A1D2E] mt-0.5">Мэдээлэл зүй</p>
          <p className="text-[9.5px] text-[#3B6FF5] font-mono mt-0.5">CS101 ▾</p>
        </div>

        {/* Nav — takes remaining space, scrolls if needed */}
        <nav className="flex-1 overflow-y-auto py-2">
          <p className="text-[8.5px] font-extrabold text-[#BCC0D4] uppercase tracking-[1px] px-3.5 pt-3 pb-1.5">Үндсэн</p>

          {menuItems.filter(i => i.section === "main").map((item) => (
            <NavLink key={item.path} item={item} active={isActive(item.path)} />
          ))}

          <div className="h-px bg-[#E2E5EF] mx-3.5 my-2" />
          <p className="text-[8.5px] font-extrabold text-[#BCC0D4] uppercase tracking-[1px] px-3.5 pb-1.5">Асуултын Сан</p>

          {menuItems.filter(i => i.section === "questions").map((item) => (
            <NavLink key={item.path} item={item} active={isActive(item.path)} />
          ))}

          <div className="h-px bg-[#E2E5EF] mx-3.5 my-2" />

          {menuItems.filter(i => i.section === "reports").map((item) => (
            <NavLink key={item.path} item={item} active={isActive(item.path)} />
          ))}
        </nav>

        {/* User profile — fixed at bottom, never shrinks */}
        <div className="h-[61px] border-t border-[#E2E5EF] flex items-center px-4 gap-3 flex-shrink-0">
          <div className="w-7 h-7 bg-[#3B6FF5] rounded-full flex items-center justify-center text-white font-extrabold text-[11px] flex-shrink-0">Б</div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-bold text-[#1A1D2E] truncate">Батбаяр Д.</p>
            <p className="text-[9px] text-[#8A90AB]">Профессор • CS</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-[52px] bg-white border-b border-[#E2E5EF] flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#1A1D2E]">
              {menuItems.find(i => i.path === location.pathname)?.name || "Хуудас"}
            </span>
            <span className="bg-[#F0F2F8] border border-[#E2E5EF] text-[#3B6FF5] text-[9.5px] px-2 py-0.5 rounded font-mono">
              {location.pathname}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 bg-[#F0F2F8] border border-[#E2E5EF] rounded-md text-xs">🔔</button>
            <button className="w-7 h-7 bg-[#F0F2F8] border border-[#E2E5EF] rounded-md text-xs">⚙️</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavLink = ({ item, active }) => (
  <Link
    to={item.path}
    className={`relative flex items-center gap-2.5 px-3.5 py-[7px] rounded-md mx-[7px] my-px text-[11.5px] transition-colors ${
      active ? "bg-[#EEF2FE] text-[#3B6FF5] font-bold" : "text-[#4A4F6A] font-medium hover:bg-[#F5F7FE]"
    }`}
  >
    {active && (
      <span className="absolute -left-[7px] top-[5px] bottom-[5px] w-[3px] bg-[#3B6FF5] rounded-r-sm" />
    )}
    <span className="text-[13px] w-4 text-center flex-shrink-0">{item.icon}</span>
    <span className="flex-1">{item.name}</span>
    {item.badge && (
      <span className={`text-[9px] font-bold px-1.5 py-px rounded-full font-mono ${
        item.badge.color === "green"
          ? "bg-[#DCFCE7] text-[#16A34A]"
          : "bg-[#FEF3C7] text-[#D97706]"
      }`}>
        {item.badge.text}
      </span>
    )}
  </Link>
);

export default Layout;
//ok
//hiihi