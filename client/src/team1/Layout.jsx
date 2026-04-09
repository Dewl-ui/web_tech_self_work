import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu";
import { syncRoleFromAuthenticatedUser } from "./utils/school";

export default function Layout() {
  useEffect(() => {
    syncRoleFromAuthenticatedUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <SideMenu />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
