import { Outlet } from 'react-router-dom';
import Card from './Card';
import { AdminSideNav } from './AdminSidenav';

export const AdminLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Sidebar */}
      <aside className="w-full md:w-[20%] lg:w-[15%] xl:w-[12%] border-r border-orange-200">
        <AdminSideNav />
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-[80%] lg:w-[85%] xl:w-[88%] p-2 sm:p-4 md:p-6 overflow-auto">
        <Card className="w-full h-full shadow-md rounded-xl bg-white">
          <Outlet />
        </Card>
      </main>
    </div>
  );
};
