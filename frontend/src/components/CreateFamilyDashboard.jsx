import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createFamily } from "@/redux/familyThunks"; // Adjust import path
import Navbar from "./shared/Navbar";

export default function CreateFamilyDashboard() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [familyName, setFamilyName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!familyName || !description) {
      // Basic validation
      return;
    }
    dispatch(createFamily({ familyName, description }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-4">
        <motion.div
          className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 p-8 sm:p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-rose-800">
            Welcome, {user?.name || "Chronicler"}!
          </h1>
          <p className="text-rose-700 mt-3 mb-8 max-w-lg mx-auto">
            Let's begin your family's story. Create a private "Family Trunk" to
            start preserving and sharing your precious memories.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label
                htmlFor="familyName"
                className="block text-sm font-medium text-rose-900 mb-1"
              >
                Family Name
              </label>
              <input
                id="familyName"
                type="text"
                placeholder="e.g., The Johnson Family"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-rose-200 bg-rose-50/50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-rose-900 mb-1"
              >
                A Short Description
              </label>
              <textarea
                id="description"
                placeholder="e.g., A collection of memories from the Johnson-Miller family line."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 rounded-lg border-2 border-rose-200 bg-rose-50/50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold text-lg py-3 rounded-lg shadow-lg shadow-green-500/20 disabled:bg-gray-400"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Creating..." : "Create Family Trunk"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
