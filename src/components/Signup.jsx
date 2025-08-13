import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRef } from "react";

function SignupCard3D({ children }) {
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const resetTransform = () => {
    cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTransform}
      className="w-full max-w-md rounded-3xl shadow-lg p-8 relative border border-white/20 transition-transform duration-150 ease-out will-change-transform"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        background: "rgba(216, 213, 213, 0.4)", // dark transparent background for readability
        backdropFilter: "blur(8px)", // soft blur only for the glass effect
        color: "white" // ensures text stays readable
      }}
    >
      {children}
    </div>
  );
}



export default function Signup() {



  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [avatar, setAvatar] = useState("ava1.png"); // default avatar
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Avatar list
  const avatars = Array.from({ length: 19 }, (_, i) => `ava${i + 1}.png`);

  const validateStep1 = () => {
    if (!email.trim()) return "Email is required";
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!re.test(email.trim())) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";
    return null;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateStep1();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setStep(2);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) return setError("OTP is required");

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          otp: otp.trim(),
          avatar, // Send avatar filename
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      navigate("/login");
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
        backgroundImage: "url('/bg/signup.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <SignupCard3D>
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#3C589D] mb-2 tracking-tight underline">
          {step === 1 ? "Create an account" : "Verify your email"}
        </h1>
        <p className="text-md mb-6 text-black">
          {step === 1
            ? "Join us today — we'll send you an OTP to verify your email."
            : `We’ve sent an OTP to ${email}. Enter it below to complete your registration.`}
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Email, Password & Avatar */}
        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-5">
            {/* Avatar selection */}
            <div className="flex items-center gap-4">
              <img
                src={`/avatars/${avatar}`}
                alt="Selected Avatar"
                className="w-14 h-14 rounded-full border-2 border-[#3C589D] shadow-md cursor-pointer hover:scale-105 transition"
                onClick={() => setShowAvatarModal(true)}
              />
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="px-3 py-1.5 text-sm rounded-lg bg-[#EEF2FF] text-[#3C589D] hover:bg-[#dfe6ff] transition"
              >
                Change Avatar
              </button>
            </div>

            {/* Email */}
            <label className="block">
              <span className="text-sm font-medium text-white">Email</span>
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
              <span className="text-sm font-medium text-white">Password</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password"
                className="mt-1 block w-full rounded-lg border-gray-300 p-3 pr-12 focus:ring-2 focus:ring-[#3C589D] outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-9 text-xs text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </label>

            {/* Confirm Password */}
            <label className="block">
              <span className="text-sm font-medium text-white">Confirm Password</span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                className="mt-1 block w-full rounded-lg border-gray-300 p-3 focus:ring-2 focus:ring-[#3C589D] outline-none shadow-sm"
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#3C589D] text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50 hover:cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={register} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">OTP</span>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit code"
                className="mt-1 block w-full rounded-lg border-gray-300 p-3 focus:ring-2 focus:ring-[#3C589D] outline-none shadow-sm"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#3C589D] text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2 transition"
            >
              ← Go back
            </button>
          </form>
        )}

        {/* Already have account */}
        {step === 1 && (
          <div className="mt-8 text-center text-md text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3C589D] font-medium hover:underline">
              Sign in
            </Link>
          </div>
        )}

        {/* Avatar Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-center text-[#3C589D]">
                Choose Your Avatar
              </h2>
              <div className="grid grid-cols-5 gap-4">
                {avatars.map((av) => (
                  <img
                    key={av}
                    src={`/avatars/${av}`}
                    alt={av}
                    onClick={() => {
                      setAvatar(av);
                      setShowAvatarModal(false);
                    }}
                    className={`w-16 h-16 rounded-full border-2 cursor-pointer shadow-sm hover:scale-105 transition ${avatar === av ? "border-[#3C589D]" : "border-transparent"
                      }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="mt-6 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </SignupCard3D>
    </div>

  );
}
