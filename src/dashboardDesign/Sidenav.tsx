import { useState, useRef, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Detect click outside to close on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <>
      {/* Toggle Button - Mobile Only */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-md shadow-md"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-40"></div>
      )}

      {/* Sidebar Drawer */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-gradient-to-b from-purple-50 to-pink-50 p-5 border-r border-purple-100 shadow-md
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block lg:z-0
        `}
      >
        {/* Header (Mobile Only) */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-purple-700">Dashboard</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Sidebar Title */}
        <h2 className="hidden lg:block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
          Dashboard
        </h2>

        <ul className="space-y-2 font-medium text-sm">
          <NavItem
            to="me"
            icon={<SquareUserRound size={20} />}
            text="My Profile"
            active={isActive("me")}
            color="purple"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="Bookings"
            icon={<FaShop size={18} />}
            text="My Bookings"
            active={isActive("Bookings")}
            color="purple"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="payments"
            icon={<FaDollarSign size={18} />}
            text="Payments"
            active={isActive("payments")}
            color="purple"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="Tickets"
            icon={<Tickets size={20} />}
            text="Tickets"
            active={isActive("Tickets")}
            color="pink"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="/setting"
            icon={<Settings size={20} />}
            text="Settings"
            active={isActive("setting")}
            color="teal"
            onClick={() => setIsOpen(false)}
          />

          {/* Back to Home */}
          <li className="pt-4 mt-4 border-t border-purple-100">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
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

const NavItem = ({
  to,
  icon,
  text,
  active,
  color = "purple",
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  color?: "purple" | "pink" | "teal";
  onClick?: () => void;
}) => {
  const gradientMap = {
    purple: "from-purple-600 to-pink-600",
    pink: "from-pink-600 to-rose-600",
    teal: "from-teal-500 to-emerald-600",
  };

  const textColorMap = {
    purple: "text-purple-500",
    pink: "text-pink-500",
    teal: "text-teal-500",
  };

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
          active
            ? `bg-gradient-to-r ${gradientMap[color]} text-white shadow-md`
            : `text-purple-800 hover:bg-purple-100 hover:${textColorMap[color]}`
        }`}
      >
        <span className={active ? "text-white" : textColorMap[color]}>
          {icon}
        </span>
        <span className="font-medium">{text}</span>
      </Link>
    </li>
  );
};
