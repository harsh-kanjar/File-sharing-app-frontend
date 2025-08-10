import React from 'react';
import {
  FaFolder,
  FaUsers,
  FaClock,
  FaTrash,
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col  w-64 h-screen fixed top-0 left-0 border border-gray-200 bg-gray-200    rounded-md  shadow-lg pt-20 px-6 space-y-6">
      {/* Links */}
      <div className="space-y-4 text-sm font-medium">
        <a href="#" className="flex items-center gap-3 hover:text-blue-400 transition">
          <FaFolder /> My Drive
        </a>
        <a href="#" className="flex items-center gap-3 hover:text-blue-400 transition">
          <FaUsers /> Shared
        </a>
        <a href="#" className="flex items-center gap-3 hover:text-blue-400 transition">
          <FaClock /> Recent
        </a>
        <a href="#" className="flex items-center gap-3 hover:text-blue-400 transition">
          <FaTrash /> Trash
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
