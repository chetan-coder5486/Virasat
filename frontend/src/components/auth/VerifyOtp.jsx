import React, { useState } from "react";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/constant";
import { useNavigate } from "react-router";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Validate email format (must contain '@')
    if (value && !value.includes("@")) {
      setEmailError("Email must include '@' symbol.");
    } else {
      setEmailError("");
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic front-end validation
    if (!email.includes("@")) {
      setMessage("Please enter a valid email containing '@'.");
      return;
    }
    if (otp.length !== 6) {
      setMessage("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        setMessage("✅ Email verified successfully! You can now log in.");
        navigate("/login");
      } else {
        setMessage(res.data.message || "Verification failed ❌");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 via-green-50 to-blue-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Verify Your Email
        </h2>

        <form onSubmit={handleVerify} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={handleEmailChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* OTP Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              OTP Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              required
              maxLength="6"
              onChange={handleOtpChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none tracking-widest text-center text-lg font-semibold"
            />
            <p className="text-gray-500 text-xs mt-1">* Only 6 digits allowed</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <p
            className={`mt-5 text-center text-sm font-medium ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Resend Option */}
        <p className="text-center mt-6 text-gray-500 text-sm">
          Didn’t receive the OTP?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
