import {
  Home,
  Settings,
  SquareUserRound,
  Tickets as TicketIcon,
  MenuIcon,
  XIcon,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <>
      {/* Toggle Button on Mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-white rounded shadow text-purple-700"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-40"></div>
      )}

      {/* Sidebar Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:block lg:z-0 border-r`}
      >
        {/* Header on Mobile */}
        <div className="lg:hidden flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-purple-700">User Panel</h2>
          <button onClick={() => setIsOpen(false)}>
            <XIcon />
          </button>
        </div>

        {/* Sidebar Content */}
        <ul className="p-4 space-y-1 font-medium text-sm">
          <h2 className="hidden lg:block text-xl font-bold text-purple-700 mb-4">
            User Panel
          </h2>

          <NavItem
            to="/"
            icon={<Home size={20} />}
            text="Home"
            active={isActive("/")}
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="Bookings"
            icon={<BookOpen size={20} />}
            text="My Bookings"
            active={isActive("/Bookings")}
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="Tickets"
            icon={<TicketIcon size={20} />}
            text="Support Tickets"
            active={isActive("/Tickets")}
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="payments"
            icon={<CreditCard size={20} />}
            text="Payments"
            active={isActive("/payments")}
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="me"
            icon={<SquareUserRound size={20} />}
            text="My Profile"
            active={isActive("/me")}
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="settings"
            icon={<Settings size={20} />}
            text="Settings"
            active={isActive("/settings")}
            onClick={() => setIsOpen(false)}
          />
        </ul>
      </div>
    </>
  );
};

const NavItem = ({
  to,
  icon,
  text,
  active,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
          active
            ? "bg-gradient-to-r from-purple-100 to-pink-100 font-semibold"
            : "hover:bg-gradient-to-r from-purple-50 to-pink-50"
        }`}
      >
        <div className="text-purple-700">{icon}</div>
        {text}
      </Link>
    </li>
  );
};
