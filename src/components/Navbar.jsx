import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("t-shrf"));
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("t-shrf");
    navigate("/signup");
  };

  return (
    <nav
      className="shadow-lg sticky top-0 z-50 border-b border-white/10"
      style={{
        background: "linear-gradient(90deg, #1e3c72, #2a5298)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-white">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold tracking-tight cursor-pointer hover:scale-105 transition-transform duration-200">
          ACloud
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-base font-medium">
          {isLoggedIn && (
            <>
              <Link
                to="/"
                className="relative hover:text-yellow-300 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
              >
                Home
              </Link>
              <Link
                to="/upload"
                className="relative hover:text-yellow-300 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
              >
                Upload
              </Link>
              <button
                onClick={handleLogout}
                className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-lg shadow-md hover:bg-yellow-300 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 text-white bg-[#1e3c72] border-t border-white/10 shadow-inner animate-slideDown">
          {isLoggedIn && (
            <>
              <Link
                to="/"
                className="block py-2 hover:text-yellow-300 transition"
              >
                Home
              </Link>
              <Link
                to="/upload"
                className="block py-2 hover:text-yellow-300 transition"
              >
                Upload
              </Link>
              <div
                onClick={handleLogout}
                className="flex items-center gap-2 mt-3 cursor-pointer bg-yellow-400 text-gray-900 px-3 py-2 rounded-lg shadow hover:bg-yellow-300 transition"
              >
                <FaUserCircle className="text-xl" />
                <span>Logout</span>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
