import { Outlet } from 'react-router-dom';
import SideMenu from './SideMenu';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <SideMenu />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}