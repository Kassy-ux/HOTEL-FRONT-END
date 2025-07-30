import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Card from './Card';
import { AdminSideNav } from './AdminSidenav';
import { MdMenu, MdClose } from 'react-icons/md';

export const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 relative">
      {/* Toggle Button (Mobile only) */}
      <button
        className="absolute top-4 left-4 z-50 text-orange-700 text-3xl md:hidden"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <MdClose /> : <MdMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-white border-r border-orange-200 shadow-md transform transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:w-[20%] lg:w-[15%] xl:w-[12%] md:block`}
      >
        <div className="h-full overflow-y-auto pt-16 md:pt-0">
          <AdminSideNav />
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full p-4 md:ml-0 md:w-[80%] lg:w-[85%] xl:w-[88%]">
        <Card className="w-full min-h-[calc(100vh-2rem)] shadow-md rounded-xl bg-white">
          <Outlet />
        </Card>
      </main>
    </div>
  );
};
