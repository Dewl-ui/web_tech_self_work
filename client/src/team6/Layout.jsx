import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex">
      <SideMenu />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;