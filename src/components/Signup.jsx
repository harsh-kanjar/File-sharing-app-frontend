import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!re.test(email.trim())) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";
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

      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (onSignup) onSignup({ username: data.username, token: data.token });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold text-[#3C589D] mb-2">Create an account</h1>
        <p className="text-sm text-gray-500 mb-6">Sign up to get started — we'll create a username from your email automatically</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-2 focus:ring-2 focus:ring-[#3C589D] focus:outline-none"
            />
          </label>

          <label className="block relative">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-2 pr-10 focus:ring-2 focus:ring-[#3C589D] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-9 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Confirm Password</span>
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-2 focus:ring-2 focus:ring-[#3C589D] focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-[#3C589D] text-white font-medium shadow-sm hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <span href="#" className="text-[#3C589D] font-medium"><Link to={"/login"}>Sign in</Link></span>
        </div>
      </div>
    </div>
  );
}
