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
    <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <MdHotelClass className="text-3xl text-purple-600 group-hover:text-pink-600 transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LuxeStay
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-purple-900 hover:text-pink-600 font-medium transition-colors flex items-center space-x-1.5"
            >
              <BiHomeSmile className="text-xl" /> 
              <span>Home</span>
            </Link>
            <Link 
              to="/about" 
              className="text-purple-900 hover:text-pink-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/Hotels" 
              className="text-purple-900 hover:text-pink-600 font-medium transition-colors"
            >
              Hotels
            </Link>
            <Link 
              to="/contact" 
              className="text-purple-900 hover:text-pink-600 font-medium transition-colors flex items-center space-x-1.5"
            >
              <BiPhoneCall className="text-xl" /> 
              <span>Contact</span>
            </Link>
            
            {!isAuthenticated ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link 
                  to="/login" 
                  className="text-purple-900 hover:text-pink-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative ml-4">
                <button 
                  onClick={toggleProfile} 
                  className="flex items-center space-x-2 group"
                >
                  <div className="relative">
                    <FaUserCircle className="text-2xl text-purple-600 group-hover:text-pink-600 transition-colors" />
                    {isProfileOpen && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <span className="text-purple-900 font-medium">{user?.firstName}</span>
                </button>
                
                {isProfileOpen && (
                  <div 
                    className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border border-purple-100 overflow-hidden z-50 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                      <p className="font-semibold text-purple-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-purple-500">{user?.userType} Account</p>
                    </div>
                    <Link
                      to={user?.role === 'admin' ? "/admindashboard/analytics" : "/dashboard/me"}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-purple-800 hover:bg-purple-50 transition-colors border-b border-purple-100"
                    >
                      <GrDashboard className="mr-3 text-purple-600" /> 
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-sm text-purple-800 hover:bg-pink-50 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3 text-pink-600" /> 
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-100 shadow-inner">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <Link 
              to="/" 
              onClick={toggleMenu} 
              className="block px-4 py-2 rounded-lg text-purple-900 hover:bg-purple-50 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={toggleMenu} 
              className="block px-4 py-2 rounded-lg text-purple-900 hover:bg-purple-50 font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/Hotels" 
              onClick={toggleMenu} 
              className="block px-4 py-2 rounded-lg text-purple-900 hover:bg-purple-50 font-medium transition-colors"
            >
              Hotels
            </Link>
            <Link 
              to="/contact" 
              onClick={toggleMenu} 
              className="block px-4 py-2 rounded-lg text-purple-900 hover:bg-purple-50 font-medium transition-colors"
            >
              Contact
            </Link>
            
            {!isAuthenticated ? (
              <div className="pt-2 space-y-3">
                <Link 
                  to="/login" 
                  onClick={toggleMenu} 
                  className="block px-4 py-2 rounded-lg text-purple-900 hover:bg-purple-50 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="block text-center px-4 py-3 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-md font-medium"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="pt-2 space-y-3">
                <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <p className="font-semibold text-purple-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-purple-500">{user?.role} Account</p>
                </div>
                <Link
                  to={user?.role === 'admin' ? "/admindashboard/analytics" : "/dashboard/me"}
                  onClick={toggleMenu}
                  className="block px-4 py-3 rounded-lg text-purple-900 hover:bg-purple-50 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-purple-900 hover:bg-pink-50 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};