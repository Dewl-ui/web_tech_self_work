import { Outlet } from 'react-router-dom';
import SideMenu from "./SideMenu";

const Layout = () => {
  return <div className='w-full flex-row gap-4 md:flex'>
    <SideMenu />
    <Outlet />
  </div>
};

export default Layout;









import { Outlet, Navigate } from "react-router-dom";
import SideMenu from "./SideMenu";
import { getUser } from "../../utils/api";

export default function Layout() {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideMenu user={user} />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}