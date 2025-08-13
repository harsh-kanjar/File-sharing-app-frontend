import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function MoreOptions( ) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("t-shrf");
    navigate("/signup");
  };
 

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8 text-base font-medium m-10">
        {/* <Link
          to="/"
          className="relative hover:text-yellow-300 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
        >
          Home
        </Link> */}
        <Link
          to="/upload"
          className="relative hover:text-yellow-300 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
        >
          Upload
        </Link>
        {/* <button
          onClick={handleLogout}
          className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-lg shadow-md hover:bg-yellow-300 transition"
        >
          Logout
        </button> */}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-4 pb-4 text-white bg-[#1e3c72] border-t border-white/10 shadow-inner animate-slideDown">
        <Link to="/" className="block py-2 hover:text-yellow-300 transition">
          Home
        </Link>
        <Link to="/upload" className="block py-2 hover:text-yellow-300 transition">
          Upload
        </Link>
        <div
          onClick={handleLogout}
          className="flex items-center gap-2 mt-3 cursor-pointer bg-yellow-400 text-gray-900 px-3 py-2 rounded-lg shadow hover:bg-yellow-300 transition"
        >
          <FaUserCircle className="text-xl" />
          <span>Logout</span>
        </div>
      </div>
    </>
  );
}

export default MoreOptions;
