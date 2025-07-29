import { useState } from "react";
import { Outlet } from "react-router-dom";
import Card from "./Card";
import { SideNav } from "./Sidenav";
import { MdMenu } from "react-icons/md";

export const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Toggle button for small screens */}
      <div className="lg:hidden p-3">
        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="text-purple-700 p-2 rounded-md bg-white shadow-md"
        >
          <MdMenu size={24} />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed lg:static top-0 left-0 z-40 h-full transition-transform duration-300 lg:translate-x-0 ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SideNav />
        </div>

        {/* Overlay when sidebar is open on small screens */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 px-2 py-4 lg:ml-64 w-full">
          <Card className="w-full max-w-7xl mx-auto">
            <Outlet />
          </Card>
        </div>
      </div>
    </div>
  );
};
