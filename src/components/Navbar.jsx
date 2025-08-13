import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("t-username");
    const token = localStorage.getItem("t-shrf");

    if (storedUsername) {
      setUsername(storedUsername);
    } else if (token) {
      fetch("http://localhost:5000/get-info", {
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
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("t-shrf");
    localStorage.removeItem("t-username");
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
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-white relative">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold tracking-tight cursor-pointer hover:scale-105 transition-transform duration-200">
          ACloud
        </div>

        {/* Username + Avatar with Dropdown */}
        {username && (
          <div className="relative group">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-white/10 group-hover:bg-white/20 transition duration-200 cursor-pointer">
              <img
                src="/avatars/ava2.png"
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300 shadow-md"
              />
              <span className="text-base font-semibold tracking-wide text-yellow-300">
                {username}
              </span>
            </div>

            {/* Dropdown (stays visible while hovering over it) */}
            <div className="absolute right-0 top-14 bg-white text-gray-900 rounded-lg shadow-lg py-2 w-40 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
