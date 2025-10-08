import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import { createCircle } from "@/redux/circleThunks";
import { useNavigate } from "react-router";


// --- (Icons and getFormattedDate function remain the same) ---
const ClockIcon = () => <span className="text-rose-500">🕒</span>;
const LightbulbIcon = () => <span className="text-amber-500">💡</span>;
const UsersIcon = () => <span className="text-sky-500">👨‍👩‍👧‍👦</span>;
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
  const today = getFormattedDate();

  // --- STATE MANAGEMENT FOR CIRCLE CREATION ---
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [circleName, setCircleName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // --- HANDLER FUNCTIONS ---
  const handleOpenCircleModal = () => setIsCircleModalOpen(true);
  const handleCloseCircleModal = () => {
    setIsCircleModalOpen(false);
    // Reset form state on close
    setCircleName("");
    setSelectedMembers([]);
  };

  const handleMemberSelect = (memberId) => {
    setSelectedMembers(
      (prev) =>
        prev.includes(memberId)
          ? prev.filter((id) => id !== memberId) // Uncheck: remove from array
          : [...prev, memberId] // Check: add to array
    );
  };

  const handleCreateCircle = (e) => {
    e.preventDefault();
    // In a real app, you would dispatch an action or call an API here
    if (!circleName || selectedMembers.length === 0) {
      alert("Please provide a circle name and select at least one member.");
      return;
    }

    dispatch(createCircle({ circleName, members: selectedMembers }));
    navigate("/circles");

    console.log("Creating Circle:", {
      circleName: circleName,
      members: selectedMembers,
    });
    handleCloseCircleModal(); // Close modal on success
  };

  const familyMembers = familyData?.members || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
      <Navbar />

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold font-serif text-rose-800">
              Welcome back, {user?.name || "Friend"}!
            </h1>
            <p className="text-rose-700">
              Here's what's happening in your family's haven.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* This button now opens the modal */}
            <button
              onClick={handleOpenCircleModal}
              className="flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              <CircleIcon />
              Create a Private Circle
            </button>
          </div>
        </header>

        {/* --- (Dashboard Grid remains the same) --- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* "On This Day" Widget */}
          <section className="lg:col-span-2 lg:row-span-2 rounded-2xl border border-rose-200/50 bg-white/60 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <ClockIcon />
              <h2 className="text-xl font-bold text-rose-800">
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
                <p className="font-semibold text-rose-900">
                  2018: Beach Trip to Goa
                </p>
              </div>
              <div className="space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=600"
                  alt="Grandma's 70th birthday"
                  className="rounded-lg object-cover aspect-video"
                />
                <p className="font-semibold text-rose-900">
                  2015: Grandma's 70th Birthday
                </p>
              </div>
            </div>
          </section>

          {/* "Memory Prompts" Widget */}
          <section className="rounded-2xl border border-rose-200/50 bg-white/60 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <LightbulbIcon />
              <h2 className="text-xl font-bold text-rose-800">Story Prompt</h2>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-serif italic text-rose-900">
                "What was the best advice your grandmother gave you?"
              </p>
              <button className="w-full rounded-lg bg-rose-100 py-2 text-rose-800 transition hover:bg-rose-200">
                Share Your Story
              </button>
            </div>
          </section>

          {/* "Recent Activity" Widget */}
          <section className="rounded-2xl border border-rose-200/50 bg-white/60 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <UsersIcon />
              <h2 className="text-xl font-bold text-rose-800">
                Recent Activity
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-rose-900">
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

      {/* --- CIRCLE CREATION MODAL --- */}
      {isCircleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold font-serif text-rose-800">
              Create a Private Circle
            </h2>
            <p className="mb-6 text-rose-700">
              Select family members to share stories with a smaller group.
            </p>

            <form onSubmit={handleCreateCircle}>
              <div className="space-y-4">
                {/* Circle Name Input */}
                <div>
                  <label
                    htmlFor="circleName"
                    className="block text-sm font-semibold text-rose-900"
                  >
                    Circle Name
                  </label>
                  <input
                    type="text"
                    id="circleName"
                    value={circleName}
                    onChange={(e) => setCircleName(e.target.value)}
                    placeholder='e.g., "The Siblings", "Cousins Club"'
                    required
                    className="mt-1 w-full rounded-lg border-rose-200 p-2 text-rose-900 shadow-sm focus:border-rose-400 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                  />
                </div>

                {/* Member Selection List */}
                <div>
                  <label className="block text-sm font-semibold text-rose-900">
                    Add Members
                  </label>
                  <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-rose-200 p-2">
                    {isLoading && (
                      <p className="p-2 text-rose-700">Loading members...</p>
                    )}
                    {error && (
                      <p className="p-2 text-red-600">Error: {error}</p>
                    )}
                    {familyMembers.map((member) => (
                      <label
                        key={member._id}
                        className="flex cursor-pointer items-center space-x-3 rounded-md p-2 hover:bg-rose-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member._id)}
                          onChange={() => handleMemberSelect(member._id)}
                          className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-rose-800">{member.fullName}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseCircleModal}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
