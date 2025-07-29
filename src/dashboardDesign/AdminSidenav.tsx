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
import { useState } from "react";

export const AdminSideNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
        <h2 className="text-lg font-bold text-purple-700">Admin Panel</h2>
        <button onClick={() => setOpen(!open)} className="text-purple-700">
          {open ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`${
          open ? "block" : "hidden"
        } md:block bg-white shadow-xl text-gray-800 min-h-screen w-full md:w-64 px-4 py-6 md:rounded-r-xl border-r border-gray-200 transition-all duration-300 z-40`}
      >
        {/* Title (only desktop) */}
        <h2 className="hidden md:block text-xl font-bold text-purple-700 mb-6">
          Admin Panel
        </h2>

        <ul className="space-y-1 text-sm font-medium">
          <li>
            <NavItem to="analytics" icon={<TrendingUpIcon />} text="Analytics" />
          </li>
          <li>
            <NavItem to="allhotels" icon={<FaShop />} text="Hotels" />
          </li>
          <li>
            <NavItem to="allbookings" icon={<FaDollarSign />} text="Bookings" />
          </li>
          <li>
            <NavItem to="allusers" icon={<FaUsers />} text="All Users" />
          </li>
          <li>
            <NavItem to="adminprofile" icon={<SquareUserRound />} text="My Profile" />
          </li>
          <li>
            <NavItem
              to="AllTickets"
              icon={<Tickets className="text-red-500" />}
              text="All Tickets"
              color="red"
            />
          </li>
          <li>
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
            />
          </li>
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
}: {
  to: string;
  icon: React.ReactNode;
  text: string;
  color?: "purple" | "red" | "green";
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
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r ${from} ${toColor} transition-all`}
    >
      <div className="text-purple-600">{icon}</div>
      {text}
    </Link>
  );
};
