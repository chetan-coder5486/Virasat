import React, { useState } from "react";
import AuthNavbar from "../shared/AuthNavbar";
// Fix 2: Import Link for client-side routing
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_ENDPOINT } from "../../utils/constant.js"; // API endpoint
import { validateMaxWords } from "@/lib/utils";

const Signup = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({ fullName: "" });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (name === "fullName") {
      const { valid, count } = validateMaxWords(value, 100);
      setErrors({
        fullName: valid
          ? ""
          : `Name has ${count} words. Maximum allowed is 100.`,
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Submitting this data:", input);
    try {
      if (errors.fullName) return;
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, input, {
        headers: {
          // Fix 1: Corrected Content-Type value
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/verify-otp"); // Redirect to VerifyOtp page after successful signup
        toast.success(res.data.message);
        // Good Practice: Reset form fields after successful submission
        setInput({
          fullName: "",
          email: "",
          phoneNumber: "",
          password: "",
        });
      }
    } catch (error) {
      console.log("Error in signup", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&auto=format&fit=crop')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen w-full" style={backgroundStyle}>
        <div className="min-h-screen w-full flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-rose-200/50 bg-rose-50/80 p-6 shadow-xl backdrop-blur-md">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-serif text-rose-800">
                Create Your Legacy
              </h2>
              <p className="mt-2 text-sm text-rose-700">
                Start preserving your family's history today.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-rose-900"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={input.fullName}
                  onChange={changeEventHandler}
                  className="mt-1 block w-full rounded-lg border-rose-300 bg-white/50 p-2.5 shadow-sm transition focus:border-rose-500 focus:ring focus:ring-rose-400 focus:ring-opacity-50"
                  placeholder="e.g., Jane Doe"
                  required
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-rose-900"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="mt-1 block w-full rounded-lg border-rose-300 bg-white/50 p-2.5 shadow-sm transition focus:border-rose-500 focus:ring focus:ring-rose-400 focus:ring-opacity-50"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Phone Number Input */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-rose-900"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="mt-1 block w-full rounded-lg border-rose-300 bg-white/50 p-2.5 shadow-sm transition focus:border-rose-500 focus:ring focus:ring-rose-400 focus:ring-opacity-50"
                  placeholder="e.g., 9876543210"
                  // Fix 3: Added basic pattern validation for 10-digit number
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-rose-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  className="mt-1 block w-full rounded-lg border-rose-300 bg-white/50 p-2.5 shadow-sm transition focus:border-rose-500 focus:ring focus:ring-rose-400 focus:ring-opacity-50"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={Boolean(errors.fullName)}
                className="w-full rounded-xl bg-rose-600 px-6 py-3 text-lg font-medium text-white shadow-md transition-colors duration-300 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-rose-800">
              Already have an account? {/* Fix 2: Replaced <a> with <Link> */}
              <Link
                to="/login"
                className="font-semibold text-rose-900 hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
