import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  LogOut,
  GraduationCap,
} from "lucide-react";

export function TeacherLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/team6/teacher", icon: LayoutDashboard, label: "Хяналтын самбар" },
    { path: "/team6/teacher/courses", icon: BookOpen, label: "Курсүүд" },
    { path: "/team6/teacher/analytics", icon: BarChart3, label: "Шинжилгээ" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">ExamHub</h1>
              <p className="text-xs text-muted-foreground">Багшийн портал</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-accent text-primary"
                      : "text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">DR</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Dr. Sarah Miller</p>
              <p className="text-xs text-muted-foreground">Профессор</p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Гарах</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
