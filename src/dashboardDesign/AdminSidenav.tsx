import {
  SquareUserRound,
  TrendingUpIcon,
  Tickets,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { FaDollarSign, FaUsers } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export const AdminSideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button (only on mobile) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-white rounded shadow text-purple-700"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Backdrop for small screens */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-40"></div>
      )}

      {/* Sidebar Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block md:z-0 border-r`}
      >
        {/* Header for Mobile */}
        <div className="md:hidden flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-purple-700">Admin Panel</h2>
          <button onClick={() => setIsOpen(false)}>
            <XIcon />
          </button>
        </div>

        {/* Sidebar Content */}
        <ul className="p-4 space-y-1 font-medium text-sm">
          <h2 className="hidden md:block text-xl font-bold text-purple-700 mb-4">
            Admin Panel
          </h2>
          <NavItem to="analytics" icon={<TrendingUpIcon />} text="Analytics" onClick={() => setIsOpen(false)} />
          <NavItem to="allhotels" icon={<FaShop />} text="Hotels" onClick={() => setIsOpen(false)} />
          <NavItem to="allbookings" icon={<FaDollarSign />} text="Bookings" onClick={() => setIsOpen(false)} />
          <NavItem to="allusers" icon={<FaUsers />} text="All Users" onClick={() => setIsOpen(false)} />
          <NavItem to="adminprofile" icon={<SquareUserRound />} text="My Profile" onClick={() => setIsOpen(false)} />
          <NavItem
            to="AllTickets"
            icon={<Tickets className="text-red-500" />}
            text="All Tickets"
            color="red"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="/"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-green-600"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            }
            text="Home"
            color="green"
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
  color = "purple",
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  text: string;
  color?: "purple" | "red" | "green";
  onClick?: () => void;
}) => {
  const from = {
    purple: "from-purple-100",
    red: "from-red-100",
    green: "from-green-100",
  }[color];

  const toColor = {
    purple: "to-blue-100",
    red: "to-red-200",
    green: "to-green-200",
  }[color];

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r ${from} ${toColor} transition-all`}
      >
        <div className="text-purple-600">{icon}</div>
        {text}
      </Link>
    </li>
  );
};
