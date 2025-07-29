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
import { useEffect, useRef, useState } from "react";

export const AdminSideNav = () => {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
        <h2 className="text-lg font-bold text-purple-700">Admin Panel</h2>
        <button onClick={() => setOpen(true)} className="text-purple-700">
          <MenuIcon size={24} />
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden"></div>
      )}

      {/* Sidebar Drawer */}
      <div
        ref={drawerRef}
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:block md:rounded-r-xl md:border-r md:border-gray-200
        `}
      >
        {/* Close Button for Mobile */}
        <div className="flex items-center justify-between md:hidden px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-purple-700">Admin Panel</h2>
          <button onClick={() => setOpen(false)}>
            <XIcon size={24} />
          </button>
        </div>

        {/* Sidebar Links */}
        <ul className="space-y-1 text-sm font-medium p-4">
          <NavItem to="analytics" icon={<TrendingUpIcon />} text="Analytics" onClick={() => setOpen(false)} />
          <NavItem to="allhotels" icon={<FaShop />} text="Hotels" onClick={() => setOpen(false)} />
          <NavItem to="allbookings" icon={<FaDollarSign />} text="Bookings" onClick={() => setOpen(false)} />
          <NavItem to="allusers" icon={<FaUsers />} text="All Users" onClick={() => setOpen(false)} />
          <NavItem to="adminprofile" icon={<SquareUserRound />} text="My Profile" onClick={() => setOpen(false)} />
          <NavItem
            to="AllTickets"
            icon={<Tickets className="text-red-500" />}
            text="All Tickets"
            color="red"
            onClick={() => setOpen(false)}
          />
          <NavItem
            to="/"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-house text-green-600"
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            }
            text="Home"
            color="green"
            onClick={() => setOpen(false)}
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
