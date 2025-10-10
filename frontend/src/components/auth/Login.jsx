import React, { useState } from "react";
import AuthNavbar from "../shared/AuthNavbar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authThunks"; // FIX 1: Import the async thunk
import { acceptInvite } from "../../redux/familyThunks"; // 3. Import the thunk

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // We can get the loading state from both slices if needed
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: familyLoading } = useSelector((state) => state.family);
  const isLoading = authLoading || familyLoading; // Combine loading states

  const [input, setInput] = useState({ email: "", password: "" });
  const inviteToken = location.state?.inviteToken;

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(input)).unwrap();

      // Check sessionStorage for a pending invite token
      const pendingInviteToken = sessionStorage.getItem("inviteToken");

      if (pendingInviteToken) {
        // 4. Dispatch the new thunk
        await dispatch(acceptInvite({ token: pendingInviteToken })).unwrap();
        sessionStorage.removeItem("inviteToken");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login or invite process failed:", error);
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
                  value={input.password}
                  onChange={changeEventHandler}
                  className="mt-1 block w-full rounded-lg border-rose-300 bg-white/50 p-2.5 shadow-sm transition focus:border-rose-500 focus:ring focus:ring-rose-400 focus:ring-opacity-50"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* FIX 3: Disable button based on loading state from Redux */}
              <button type="submit" disabled={isLoading} className="...">
                {isLoading ? "Please wait..." : "Log In"}
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

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../../redux/authThunks';

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   // We can get the loading state from both slices if needed
//   const { loading: authLoading } = useSelector(state => state.auth);
//   const { loading: familyLoading } = useSelector(state => state.family);
//   const isLoading = authLoading || familyLoading; // Combine loading states

//   const [input, setInput] = useState({ email: "", password: "" });
//   const inviteToken = location.state?.inviteToken;

//   const changeEventHandler = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(loginUser(input)).unwrap();

//       if (inviteToken) {
//         // 4. Dispatch the new thunk
//         await dispatch(acceptInvite({ token: inviteToken })).unwrap();
//       }

//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Login or invite process failed:", error);
//     }
//   };

//   return (
//     // ... your JSX, using 'isLoading' to disable the button
//     <button
//       type="submit"
//       disabled={isLoading}
//       className="..."
//     >
//       {isLoading ? "Please wait..." : "Log In"}
//     </button>
//   );
// };

// export default Login;
