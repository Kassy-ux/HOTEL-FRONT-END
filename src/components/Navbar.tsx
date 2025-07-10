import { useState } from "react";
import { BiHomeSmile, BiPhoneCall } from "react-icons/bi";
import { MdHotelClass } from "react-icons/md";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { GrDashboard } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { clearCredentials } from "../features/auth/authSlice";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/");
    setIsProfileOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur border-b shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <MdHotelClass className="text-3xl text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            LuxeStay
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-600 text-gray-700 font-medium flex items-center space-x-1">
            <BiHomeSmile className="text-xl" /> <span>Home</span>
          </Link>
          <Link to="/about" className="hover:text-pink-500 text-gray-700 font-medium">About</Link>
          <Link to="/Hotels" className="hover:text-pink-500 text-gray-700 font-medium">Hotels</Link>
          <Link to="/contact" className="hover:text-purple-500 text-gray-700 font-medium flex items-center space-x-1">
            <BiPhoneCall className="text-xl" /> <span>Contact</span>
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={toggleProfile} className="flex items-center space-x-2">
                <FaUserCircle className="text-2xl text-gray-700" />
                <span className="text-gray-700">{user?.firstName}</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border p-2 z-50">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.userType} Account</p>
                  </div>
                  <Link
                    to={user?.userType === 'admin' ? "/admindashboard/analytics" : "/dashboard/me"}
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 flex items-center"
                  >
                    <GrDashboard className="mr-2 text-blue-600" /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm hover:bg-red-50 text-gray-700 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2 text-red-500" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white border-t">
          <Link to="/" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/about" onClick={toggleMenu} className="block text-gray-700 hover:text-pink-500">About</Link>
          <Link to="/Hotels" className="hover:text-pink-500 text-gray-700 font-medium">Hotels</Link>
          <Link to="/contact" onClick={toggleMenu} className="block text-gray-700 hover:text-purple-500">Contact</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={toggleMenu} className="block text-gray-700 hover:text-blue-600">Login</Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full text-center"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="px-3 py-2 bg-blue-50 rounded-md">
                <p className="font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.userType} Account</p>
              </div>
              <Link
                to={user?.userType === 'admin' ? "/admindashboard/analytics" : "/dashboard/me"}
                onClick={toggleMenu}
                className="block text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-gray-700 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};