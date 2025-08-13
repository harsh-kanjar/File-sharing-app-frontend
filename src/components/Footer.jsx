import React from 'react';

function Footer() {
  return (
    <footer className="w-full text-white py-6 px-4 "
      style={{
        background: 'linear-gradient(90deg, #0e1e45, #3b538f, #0e1e45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold">ACloud</h2>
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
