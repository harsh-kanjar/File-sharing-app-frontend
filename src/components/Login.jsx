import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../Design/Card";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) return "Email is required";
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!re.test(email.trim())) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        email: email.toLowerCase().trim(),
        password,
      };

      const res = await fetch("https://file-sharing-app-backend-5xpl.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Store token in localStorage
      localStorage.setItem("t-shrf", data.token);

      if (onLogin) onLogin({ username: data.username, token: data.token });

      // ✅ Redirect to homepage
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#EAF0FF]/80 to-[#FDFEFF]/80"
      style={{
        backgroundImage: "url('/bg/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card>
        <div className="">
          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight underline">
            Welcome back
          </h1>
          <p className="text-md mb-6 text-black">
            Sign in to your account to continue
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <label className="block">
              <span className="text-md font-medium text-white">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-lg border-gray-300 p-3 focus:ring-2 focus:ring-[#3C589D] outline-none shadow-sm"
              />
            </label>

            {/* Password */}
            <label className="block relative">
              <span className="text-md font-medium text-white">Password</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 block w-full rounded-lg border-gray-300 p-3 pr-12 focus:ring-2 focus:ring-[#3C589D] outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="mt-2 absolute right-3 top-9 text-md text-black cursor-pointer  "
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </label>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-[#3C589D]"
                />
                <span className="text-sm">Remember me</span>
              </label>

              <a href="#" className="text-sm text-[#3C589D] hover:underline">
                Forgot?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#3C589D] text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center text-md text-black">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#3C589D] font-medium hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </Card>
    </div>


  );
}
