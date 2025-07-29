import { useState } from "react";
import {
  SquareUserRound,
  Tickets,
  Settings,
  Home,
  Menu,
  X,
} from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export const SideNav = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Start closed on mobile

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <>
      {/* Toggle Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-md shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64
          bg-gradient-to-b from-purple-50 to-pink-50 p-5 border-r border-purple-100 shadow-md
          transform transition-transform duration-300 ease-in-out

          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative lg:block
        `}
      >
        <div className="mb-8 pl-3">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Dashboard
          </h2>
        </div>

        <ul className="space-y-2">
          {[
            {
              to: "me",
              icon: <SquareUserRound size={20} />,
              label: "My Profile",
              gradient: "from-purple-600 to-pink-600",
              color: "text-purple-500",
            },
            {
              to: "Bookings",
              icon: <FaShop size={18} />,
              label: "My Bookings",
              gradient: "from-purple-600 to-pink-600",
              color: "text-purple-500",
            },
            {
              to: "payments",
              icon: <FaDollarSign size={18} />,
              label: "Payments",
              gradient: "from-purple-600 to-pink-600",
              color: "text-purple-500",
            },
            {
              to: "Tickets",
              icon: <Tickets size={20} />,
              label: "Tickets",
              gradient: "from-pink-600 to-rose-600",
              color: "text-pink-500",
            },
            {
              to: "/setting",
              icon: <Settings size={20} />,
              label: "Settings",
              gradient: "from-teal-500 to-emerald-600",
              color: "text-teal-500",
            },
          ].map(({ to, icon, label, gradient, color }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive(to)
                    ? `bg-gradient-to-r ${gradient} text-white shadow-md`
                    : `text-purple-800 hover:bg-purple-100 hover:${color}`
                }`}
              >
                <span
                  className={`${
                    isActive(to) ? "text-white" : color
                  }`}
                >
                  {icon}
                </span>
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}

          {/* Back to Home */}
          <li className="pt-4 mt-4 border-t border-purple-100">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-xl text-purple-800 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
            >
              <Home className="text-purple-500" size={20} />
              <span className="font-medium">Back to Home</span>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};
