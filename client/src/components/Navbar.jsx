import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../redux/user/user.slice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlelogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {
          method: "get",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error("Logout failed. Please check your credentials.");
        return;
      }
      dispatch(removeUser());
      toast.success("Logout successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleNavScroll = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-2 bg-gray-900/95 backdrop-blur-md shadow-xl' : 'py-3 bg-gray-900/80'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 animate-text-gradient">
                  AddWise
                </h2>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors duration-300 font-medium text-sm"
                >
                  Home
                </Link>
                <a
                  href="#features"
                  onClick={e => handleNavScroll(e, "features")}
                  className="text-gray-300 hover:text-white transition-colors duration-300 font-medium text-sm"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={e => handleNavScroll(e, "pricing")}
                  className="text-gray-300 hover:text-white transition-colors duration-300 font-medium text-sm"
                >
                  Pricing
                </a>
              </div>

              {!user.isLoggedIn ? (
                <div className="flex items-center space-x-4 ml-6">
                  <Link to="/login">
                    <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="px-5 py-2 rounded-lg bg-gray-800 text-white text-sm font-bold border border-gray-700 hover:bg-gray-700 transition-all duration-300">
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4 ml-6">
                  <Link to={user.user.role === "admin" ? "/admin" : "/user"}>
                    <button className="px-5 py-2 rounded-lg bg-gray-800 text-white text-sm font-bold border border-gray-700 hover:bg-gray-700 transition-all duration-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                    </button>
                  </Link>
                  <Link to="/scanner">
                    <button className="px-5 py-2 rounded-lg bg-blue-900/30 text-blue-400 text-sm font-bold border border-blue-800/50 hover:bg-blue-900/50 transition-all duration-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      Scanner
                    </button>
                  </Link>
                  <button
                    onClick={handlelogout}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-pink-600 text-white text-sm font-bold hover:from-amber-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}>
          <div className="container mx-auto px-4 pt-2 pb-4 space-y-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={(e) => { handleNavScroll(e, "features"); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => { handleNavScroll(e, "pricing"); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-300"
            >
              Pricing
            </a>

            <div className="pt-2 border-t border-gray-700">
              {!user.isLoggedIn ? (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full px-3 py-2 rounded-md text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-3 py-2 rounded-md text-center bg-gray-800 text-white font-medium border border-gray-700 hover:bg-gray-700 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to={user.user.role === "admin" ? "/admin" : "/user"}
                    className="block w-full px-3 py-2 rounded-md text-center bg-gray-800 text-white font-medium border border-gray-700 hover:bg-gray-700 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/scanner"
                    className="block w-full px-3 py-2 rounded-md text-center bg-blue-900/30 text-blue-400 font-medium border border-blue-800/50 hover:bg-blue-900/50 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    QR Scanner
                  </Link>
                  <button
                    onClick={() => { handlelogout(); setMobileMenuOpen(false); }}
                    className="block w-full px-3 py-2 rounded-md text-center bg-gradient-to-r from-amber-600 to-pink-600 text-white font-medium hover:from-amber-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Toast notification container */}
      <ToastContainer 
        position="top-center" 
        autoClose={2000} 
        theme="dark"
        toastClassName="bg-gray-800 border border-gray-700 rounded-lg"
        progressClassName="bg-gradient-to-r from-purple-500 to-pink-500"
      />
    </>
  );
};

export default Navbar;