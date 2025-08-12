import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = email/password, 2 = otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validate inputs before sending OTP
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

      setStep(2); // Go to OTP step
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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // ✅ Redirect to login after successful registration
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold text-[#3C589D] mb-2">
          {step === 1 ? "Create an account" : "Verify your email"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {step === 1
            ? "Sign up to get started — we'll send an OTP to verify your email"
            : `We've sent an OTP to ${email}. Please enter it below to complete registration.`}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Email & Password */}
        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-lg border-gray-200 p-2 focus:ring-2 focus:ring-[#3C589D] outline-none"
              />
            </label>

            <label className="block relative">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password"
                className="mt-1 block w-full rounded-lg border-gray-200 p-2 pr-10 focus:ring-2 focus:ring-[#3C589D] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
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
                className="mt-1 block w-full rounded-lg border-gray-200 p-2 focus:ring-2 focus:ring-[#3C589D] outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl bg-[#3C589D] text-white font-medium hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={register} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">OTP</span>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit code"
                className="mt-1 block w-full rounded-lg border-gray-200 p-2 focus:ring-2 focus:ring-[#3C589D] outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl bg-[#3C589D] text-white font-medium hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 mt-2"
            >
              ← Go back
            </button>
          </form>
        )}

        {step === 1 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3C589D] font-medium">
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
