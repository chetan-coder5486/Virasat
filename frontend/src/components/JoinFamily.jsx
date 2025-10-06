import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_API_ENDPOINT, FAMILY_API_ENDPOINT } from "@/utils/constant";

const FamilyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green-500"
  >
    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
    <path d="M2 7h20" />
    <path d="M12 4v16" />
  </svg>
);

export default function JoinFamily() {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationData, setVerificationData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const handleVerifyInvite = async (tokenToVerify) => {
    const code = typeof tokenToVerify === 'string' ? tokenToVerify : inviteCode;

    if (typeof tokenToVerify.preventDefault === 'function') {
      tokenToVerify.preventDefault();
    }
    
    setIsLoading(true);
    setError("");
    try {
      // FIX: Use the 'code' variable here, NOT 'inviteCode' from state, to avoid stale state issues.
      const response = await axios.post(`${USER_API_ENDPOINT}/verify-invite`, {
        token: code,
      });
      if (response.data.success) {
        setVerificationData(response.data.data);
        setIsVerified(true);
        toast.success("Invitation is valid!");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid or expired invitation.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setInviteCode(tokenFromUrl);
      handleVerifyInvite(tokenFromUrl);
    }
  }, [searchParams]);

  const handleAcceptInvite = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in or create an account to accept the invitation.");
      navigate("/login", { state: { from: "/join-family", inviteToken: inviteCode } });
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${FAMILY_API_ENDPOINT}/accept-invite`,
        { token: inviteCode },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to join family.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-rose-50 to-green-100 p-4">
      <motion.div
        className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 overflow-hidden"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <div className="p-8 sm:p-10 text-center">
          <FamilyIcon />
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-rose-800 mt-4">
            Join Your Family
          </h1>
          <AnimatePresence mode="wait">
            {!isVerified ? (
              // -- STATE 1: VERIFICATION FORM --
              <motion.div
                key="verify-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-rose-700 mt-3 mb-8">
                  Enter the invitation code below to verify your invitation.
                </p>
                <form onSubmit={handleVerifyInvite} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Invitation Code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full px-4 py-3 text-center text-lg tracking-widest font-mono rounded-lg border-2 border-rose-200 bg-rose-50/50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-rose-600 text-white font-bold text-lg py-3 rounded-lg shadow-lg shadow-rose-500/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? "Verifying..." : "Verify Invitation"}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              // -- STATE 2: ACCEPTANCE CONFIRMATION --
              <motion.div
                key="accept-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-green-800 font-semibold bg-green-100 p-3 rounded-lg mt-3 mb-8">
                  Great! You've been invited to join the{" "}
                  <span className="font-bold">
                    {verificationData?.familyName || "family"}
                  </span>
                  .
                </p>
                <motion.button
                  onClick={handleAcceptInvite}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white font-bold text-lg py-3 rounded-lg shadow-lg shadow-green-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading
                    ? "Joining..."
                    : isAuthenticated
                    ? "Accept & Join Family"
                    : "Login to Accept"}
                </motion.button>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}