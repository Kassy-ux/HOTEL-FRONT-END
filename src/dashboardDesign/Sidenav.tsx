import { SquareUserRound, Tickets, Settings, Home } from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export const SideNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-5 border-r border-purple-100 shadow-sm">
      <div className="mb-8 pl-3">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Dashboard
        </h2>
      </div>

      <ul className="space-y-2">
        <li>
          <Link
            to="me"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive("me")
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "text-purple-800 hover:bg-purple-100 hover:text-purple-700"
            }`}
          >
            <SquareUserRound
              className={`${
                isActive("me") ? "text-white" : "text-purple-500"
              }`}
              size={20}
            />
            <span className="font-medium">My Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to="Bookings"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive("Bookings")
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "text-purple-800 hover:bg-purple-100 hover:text-purple-700"
            }`}
          >
            <FaShop
              className={`${
                isActive("Bookings") ? "text-white" : "text-purple-500"
              }`}
              size={18}
            />
            <span className="font-medium">My Bookings</span>
          </Link>
        </li>
        <li>
          <Link
            to="payments"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive("payments")
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "text-purple-800 hover:bg-purple-100 hover:text-purple-700"
            }`}
          >
            <FaDollarSign
              className={`${
                isActive("payments") ? "text-white" : "text-purple-500"
              }`}
              size={18}
            />
            <span className="font-medium">Payments</span>
          </Link>
        </li>
        <li>
          <Link
            to="Tickets"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive("Tickets")
                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                : "text-purple-800 hover:bg-pink-100 hover:text-pink-700"
            }`}
          >
            <Tickets
              className={`${
                isActive("Tickets") ? "text-white" : "text-pink-500"
              }`}
              size={20}
            />
            <span className="font-medium">Tickets</span>
          </Link>
        </li>
        <li>
          <Link
            to="/setting"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive("setting")
                ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md"
                : "text-purple-800 hover:bg-teal-100 hover:text-teal-700"
            }`}
          >
            <Settings
              className={`${
                isActive("setting") ? "text-white" : "text-teal-500"
              }`}
              size={20}
            />
            <span className="font-medium">Settings</span>
          </Link>
        </li>
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
  );
};