import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, FileText, LogOut, GraduationCap } from "lucide-react";

export function StudentLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/team6/student", icon: LayoutDashboard, label: "Хяналтын самбар" },
    { path: "/team6/student/exams", icon: FileText, label: "Миний шалгалт" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">ExamHub</h1>
                <p className="text-xs text-muted-foreground">Сурагч</p>
              </div>
            </div>

            <nav className="flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? "bg-accent text-primary"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">ББ</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Бат Батболд</p>
                  <p className="text-xs text-muted-foreground">STU001</p>
                </div>
              </div>
              <Link
                to="/"
                className="p-2 rounded-lg text-muted-foreground hover:bg-accent/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
