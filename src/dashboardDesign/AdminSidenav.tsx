import { SquareUserRound, TrendingUpIcon, Tickets } from "lucide-react";
import { FaDollarSign, FaUsers } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const AdminSideNav = () => {
  return (
    <ul className="menu bg-white shadow-xl text-gray-800 min-h-screen px-4 py-6 w-64 rounded-r-xl border-r border-gray-200">
      <h2 className="text-xl font-bold text-blue-600 mb-6">Admin Panel</h2>

      <li className="my-1">
        <Link
          to="analytics"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r from-blue-100 to-purple-100 transition-all"
        >
          <TrendingUpIcon className="text-purple-600" />
          Analytics
        </Link>
      </li>

      <li className="my-1">
        <Link
          to="allhotels"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r from-blue-100 to-purple-100 transition-all"
        >
          <FaShop className="text-purple-600" />
          Hotels
        </Link>
      </li>

      <li className="my-1">
        <Link
          to="allbookings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r from-blue-100 to-purple-100 transition-all"
        >
          <FaDollarSign className="text-purple-600" />
          Bookings
        </Link>
      </li>

      <li className="my-1">
        <Link
          to="allusers"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r from-blue-100 to-purple-100 transition-all"
        >
          <FaUsers className="text-purple-600" />
          All Users
        </Link>
      </li>

      <li className="my-1">
        <Link
          to="adminprofile"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r from-blue-100 to-purple-100 transition-all"
        >
          <SquareUserRound className="text-purple-600" />
          My Profile
        </Link>
      </li>

      <li className="my-1">
        <Link
          to="AllTickets"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r from-red-100 to-red-200 transition-all"
        >
          <Tickets className="text-red-500" />
          AllTickets
        </Link>
      </li>

      <li className="my-1">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r from-green-100 to-green-200 transition-all"
        >
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
          Home
        </Link>
      </li>
    </ul>
  );
};
