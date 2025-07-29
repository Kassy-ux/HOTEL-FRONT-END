import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, SquareUserRound, Tickets, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

export const SideNav = ({ isOpen, setIsOpen }: Props) => {
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

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
  }, [isOpen, setIsOpen]);

  const isActive = (path: string) => location.pathname.includes(path);

  return (
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
      <div className="lg:hidden flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-purple-700">Dashboard</h2>
        <button onClick={() => setIsOpen(false)}>
          <X size={22} />
        </button>
      </div>

      <h2 className="hidden lg:block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
        Dashboard
      </h2>

      <nav className="flex flex-col space-y-4">
        <Link
          to="/"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-100 text-purple-800 ${
            isActive("/") ? "bg-purple-200 font-bold" : ""
          }`}
        >
          <Home size={18} />
          <span>Home</span>
        </Link>
        <Link
          to="/tickets"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-100 text-purple-800 ${
            isActive("/tickets") ? "bg-purple-200 font-bold" : ""
          }`}
        >
          <Tickets size={18} />
          <span>Tickets</span>
        </Link>
        <Link
          to="/profile"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-100 text-purple-800 ${
            isActive("/profile") ? "bg-purple-200 font-bold" : ""
          }`}
        >
          <SquareUserRound size={18} />
          <span>Profile</span>
        </Link>
        <Link
          to="/settings"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-100 text-purple-800 ${
            isActive("/settings") ? "bg-purple-200 font-bold" : ""
          }`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};
