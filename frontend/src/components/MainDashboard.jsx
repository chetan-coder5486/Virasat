import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import { createCircle } from "@/redux/circleThunks";
import { useNavigate } from "react-router";
import { CreateCircleModal } from "./CreateCircleModal";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { FAMILY_API_ENDPOINT } from "@/utils/constant";

// --- Icons updated with the new color theme ---
const ClockIcon = () => <span className="text-sky-500">🕒</span>;
const LightbulbIcon = () => <span className="text-green-500">💡</span>;
const UsersIcon = () => <span className="text-blue-500">👨‍👩‍👧‍👦</span>;
const CircleIcon = () => <span className="mr-2">👥</span>;

const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";
  return `${month} ${day}${suffix}`;
};
// Sample family members data (In a real app, this would come from Redux or an API)

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { familyData, isLoading, error } = useSelector((state) => state.family);
  const handleExportPdf = async () => {
    try {
      const params = {
        onlyMilestones: "false",
        excludeCircles: "true",
        sort: "asc",
        includeTags: "true",
      };
      const response = await axios.get(`${FAMILY_API_ENDPOINT}/export-pdf`, {
        params,
        responseType: "blob",
        withCredentials: true,
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const familyName = familyData?.familyName || "Family_Trunk";
      a.download = `${familyName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export PDF:", err);
      // Optional: surface a toast if your app uses it
    }
  };
  const today = getFormattedDate();

  // --- STATE MANAGEMENT FOR CIRCLE CREATION ---
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);

  const familyMembers = familyData?.members || [];

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            {/* 2. New Text Colors: Using sky and slate for better contrast */}
            <h1 className="text-3xl font-bold font-serif text-sky-800">
              Welcome back, {user?.name || "Friend"}!
            </h1>
            <p className="text-slate-600">
              Here's what's happening in your family's haven.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* 3. New Button Colors: A vibrant blue for the primary action */}
            <button
              onClick={() => setIsCircleModalOpen(true)}
              className="flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 cursor-pointer"
            >
              <CircleIcon />
              Create a Private Circle
            </button>
            <button
              onClick={handleExportPdf}
              className="flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              title="Export a PDF of your family's memories"
            >
              📄 Export PDF
            </button>
          </div>
        </header>

        {/* --- Dashboard Grid with updated card styles --- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <section className="lg:col-span-2 lg:row-span-2 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <ClockIcon />
              <h2 className="text-xl font-bold text-sky-800">
                On This Day: {today}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1515935334887-18a03c274b55?w=600"
                  alt="Family vacation 2018"
                  className="rounded-lg object-cover aspect-video"
                />
                <p className="font-semibold text-sky-800">
                  2018: Beach Trip to Goa
                </p>
              </div>
              <div className="space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=600"
                  alt="Grandma's 70th birthday"
                  className="rounded-lg object-cover aspect-video"
                />
                <p className="font-semibold text-sky-800">
                  2015: Grandma's 70th Birthday
                </p>
              </div>
            </div>
          </section>

          {/* "Memory Prompts" Widget */}
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <LightbulbIcon />
              <h2 className="text-xl font-bold text-sky-800">Story Prompt</h2>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-serif italic text-slate-800">
                "What was the best advice your grandmother gave you?"
              </p>
              <button className="w-full rounded-lg bg-sky-100 py-2 text-sky-800 transition hover:bg-sky-200 cursor-pointer">
                Share Your Story
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <UsersIcon />
              <h2 className="text-xl font-bold text-sky-800">
                Recent Activity
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="font-semibold">Aunt Carol</span> added 5 photos
                to "Summer BBQ 2024".
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold">Your cousin, Mike</span>{" "}
                commented on a story.
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold">Your dad</span> uploaded a video
                of "First Steps".
              </li>
            </ul>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {isCircleModalOpen && (
          <CreateCircleModal
            isOpen={isCircleModalOpen}
            onClose={() => setIsCircleModalOpen(false)}
            familyMembers={familyMembers}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
