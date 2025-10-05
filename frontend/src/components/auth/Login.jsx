import React, { useState } from "react";
import AuthNavbar from "../shared/AuthNavbar";
import axios from "axios"; // Assuming you use axios
import { useNavigate } from "react-router-dom"; // For navigation
import { useDispatch } from "react-redux"; // For Redux state
import toast from "react-hot-toast"; // For notifications
import { setLoading,loginSuccess } from "../../redux/authSlice"; // Redux action
import { USER_API_ENDPOINT } from "../../utils/constant.js" // API endpoint

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Step 1: Initialize state for form inputs
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  // This function updates the state when the user types
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // This function handles the logic when the form is submitted
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
        dispatch(loginSuccess());
      }
    } catch (error) {
      console.log("Error in login:", error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
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
          <div className="w-full max-w-md space-y-6 rounded-2xl border border-rose-200/50 bg-rose-50/80 p-8 shadow-xl backdrop-blur-md">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-serif text-rose-800">
                Welcome Back
              </h2>
              <p className="mt-2 text-rose-700">
                Log in to access your family's memories.
              </p>
            </div>

            {/* Step 3: Add onSubmit to the form tag */}
            <form onSubmit={submitHandler} className="space-y-5">
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
                  // Step 2: Bind the input's value to state
                  value={input.email}
                  onChange={changeEventHandler}
                  className="mt-1 block w-full rounded-lg border-rose-300 bg-white/50 p-2.5 shadow-sm transition focus:border-rose-500 focus:ring focus:ring-rose-400 focus:ring-opacity-50"
                  placeholder="you@example.com"
                  required
                />
              </div>

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
                  // Step 2: Bind the input's value to state
                  value={input.password}
                  onChange={changeEventHandler}
                  className="mt-1 block w-full rounded-lg border-rose-300 bg-white/50 p-2.5 shadow-sm transition focus:border-rose-500 focus:ring focus:ring-rose-400 focus:ring-opacity-50"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* The button's type="submit" triggers the form's onSubmit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-rose-600 px-6 py-3 text-lg font-medium text-white shadow-md transition-colors duration-300 hover:bg-rose-700"
              >
                Log In
              </button>
            </form>

            <p className="text-center text-sm text-rose-800">
              Don't have an account yet?{" "}
              <a href="/signup" className="font-semibold hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;