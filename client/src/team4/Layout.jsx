import { Outlet } from 'react-router-dom';

const Layout = () => {
  return <div className='w-full flex-row gap-4 md:flex'>
    <Outlet />
  </div>
};

export default Layout;
