import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  // team5 гэсэн үндсэн замыг тодорхойлно
  const base = "/team5";

  const menuItems = [
    { name: "Хяналтын самбар", path: `${base}/dashboard`, icon: "📊" },
    { name: "Хичээлүүд", path: `${base}/home`, icon: "📚" },
    { name: "Асуултын төрөл", path: `${base}/courses/1/questions/types`, icon: "📁" }, 
    { name: "Асуултын түвшин", path: `${base}/courses/1/questions/levels`, icon: "📶" },
    { name: "Асуулт жагсаалт", path: `${base}/courses/1/questions`, icon: "📝" },
    { name: "Тайлан / Статистик", path: "#", icon: "📉" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[#E2E5EF] flex flex-col fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#3B6FF5] rounded-lg flex items-center justify-center text-white text-sm">🎓</div>
            <div>
              <h2 className="text-[11px] font-extrabold text-[#1A1D2E] leading-tight">Их Сургуулийн Систем</h2>
              <p className="text-[8.5px] text-[#8A90AB]">Асуултын Удирдлага</p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="text-[8px] font-extrabold text-[#BCC0D4] uppercase mb-4 tracking-[1.1px] px-2">Үндсэн</p>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  location.pathname === item.path 
                  ? "bg-[#EEF2FE] text-[#3B6FF5]" 
                  : "text-[#4A4F6A] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[13px]">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.name === "Хичээлүүд" && (
                  <span className="bg-[#DCFCE7] text-[#16A34A] text-[9px] px-1.5 py-0.5 rounded-full font-bold">8</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-[#E2E5EF]">
          <div className="flex items-center gap-3 p-2">
            <div className="w-7 h-7 bg-[#3B6FF5] rounded-full flex items-center justify-center text-white font-extrabold text-[11px]">Б</div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-[#1A1D2E] truncate">Батбаяр Д.</p>
              <p className="text-[9px] text-[#8A90AB]">Профессор • CS</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
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

export default Layout;