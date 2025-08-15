import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("t-username");
    const storedAvatar = localStorage.getItem("t-avatar");
    const token = localStorage.getItem("t-shrf");

    if (storedUsername && storedAvatar) {
      setUsername(storedUsername);
      setAvatar(storedAvatar); // assuming you have setAvatar state
    } else if (token) {
      fetch("https://file-sharing-app-backend-5xpl.onrender.com/get-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.username) {
            localStorage.setItem("t-username", data.user.username);
            setUsername(data.user.username);
          }
          if (data?.user?.avatar) {
            localStorage.setItem("t-avatar", data.user.avatar);
            setAvatar(data.user.avatar);
          }
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
        });
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("t-shrf");
    localStorage.removeItem("t-username");
    localStorage.removeItem("t-avatar");
    navigate("/signup");
  };

  return (
    <nav
      className="bg-gray-400 sticky top-0 z-50 border-b border-white/20 shadow-lg backdrop-blur-md"
      style={{
        background: "rgba(255, 255, 255, 0.15)", // semi-transparent
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-white relative">
        {/* Logo */}
        <div className="cursor-pointer hover:scale-105 transition-transform duration-200">
          <Link to={"/"}><img
            src="/logo2.png"
            alt="ACloud Logo"
            className="h-16 md:h-18 object-contain mix-blend-multiply"
          /></Link>
        </div>



        {/* Username + Avatar with Dropdown */}
        {username && (
          <div className="relative group">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 backdrop-blur-md border border-white/30 shadow-md hover:shadow-lg hover:shadow-blue-500/30 group-hover:from-blue-500 group-hover:via-blue-600 group-hover:to-blue-700 transition-all duration-300 cursor-pointer">
              <img
                src={`/avatars/${avatar}`}
                alt="User Avatar"
                className="w-11 h-11 rounded-full object-cover border-2 border-yellow-300 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-base font-semibold tracking-wide text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">
                {username}
              </span>
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 top-14 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-md text-gray-900 rounded-xl shadow-lg py-2 w-44 border border-white/20 transform scale-95 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-300 origin-top-right">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}


      </div>
    </nav>
  );
}
