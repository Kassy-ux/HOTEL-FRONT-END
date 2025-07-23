import { SquareUserRound,  Tickets } from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const SideNav = () => {
  return (
    <aside className="w-full min-h-full bg-white shadow-md rounded-lg p-4">
      <ul className="flex flex-col gap-4 text-gray-700">
        <li>
          <Link
            to="me"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
          >
            <SquareUserRound className="text-orange-500" />
            <span className="font-medium">My Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to="Bookings"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
          >
            <FaShop className="text-orange-500" />
            <span className="font-medium">My Bookings</span>
          </Link>
        </li>
        <li>
          <Link
            to="payments"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
          >
            <FaDollarSign className="text-orange-500" />
            <span className="font-medium">Payments</span>
          </Link>
        </li>
        <li>
          <Link
            to="Tickets"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
          >
            <Tickets className="text-red-500" />
            <span className="font-medium">Tickets</span>
          </Link>
        </li>
        <li>
          <Link
            to="/setting"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-green-100 hover:text-green-600 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house text-green-500"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span className="font-medium">setting</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};
