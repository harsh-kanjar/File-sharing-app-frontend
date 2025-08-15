import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full text-white py-6 px-4 bg-blue-400 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <div className="cursor-pointer hover:scale-105 transition-transform duration-200">
            <Link to={"/"}><img
              src="/logo2.png"
              alt="ACloud Logo"
              className="h-16 md:h-18 object-contain mix-blend-multiply"
            /></Link>
          </div>
          <p className="text-sm text-gray-300">© 2025 All rights reserved.</p>
          <p className="text-sm text-gray-300">Hobby project for learning purpose</p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
          <a href="#" className="hover:underline text-gray-200">Privacy Policy</a>
          <a href="#" className="hover:underline text-gray-200">Terms</a>
          <a href="#" className="hover:underline text-gray-200">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
