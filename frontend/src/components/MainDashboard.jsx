import React from 'react';
import { useSelector } from 'react-redux'; // FIX 1: Import useSelector to get data from Redux
import Navbar from './shared/Navbar';

// You would typically import icons from a library like 'lucide-react' or 'heroicons'
const ClockIcon = () => <span className="text-rose-500">🕒</span>;
const LightbulbIcon = () => <span className="text-amber-500">💡</span>;
const UsersIcon = () => <span className="text-sky-500">👨‍👩‍👧‍👦</span>;

// Helper function to format the date with a suffix (e.g., 1st, 2nd, 3rd, 4th)
const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';
  return `${month} ${day}${suffix}`;
};

const Dashboard = () => {
  // FIX 2: Get the user object from the Redux store
  const { user } = useSelector((state) => state.auth);
  // FIX 3: Removed unused 'isPopoverOpen' state

  // IMPROVEMENT: Get the current date dynamically
  const today = getFormattedDate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Header: Welcome Message & Primary CTA */}
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold font-serif text-rose-800">
              {/* FIX 4: Display the user's name dynamically with a fallback */}
              Welcome back, {user?.name || 'Friend'}!
            </h1>
            <p className="text-rose-700">Here's what's happening in your family's haven.</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-lg font-medium text-white shadow-md transition-colors duration-300 hover:bg-rose-700">
            <span className="text-2xl font-light">+</span> Add a Memory
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          
          {/* "On This Day" Widget */}
          <section className="lg:col-span-2 lg:row-span-2 rounded-2xl border border-rose-200/50 bg-white/60 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <ClockIcon />
              <h2 className="text-xl font-bold text-rose-800">
                {/* IMPROVEMENT: Display the current date */}
                On This Day: {today}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <img src="https://images.unsplash.com/photo-1515935334887-18a03c274b55?w=600" alt="Family vacation 2018" className="rounded-lg object-cover aspect-video"/>
                <p className="font-semibold text-rose-900">2018: Beach Trip to Goa</p>
              </div>
              <div className="space-y-2">
                 <img src="https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=600" alt="Grandma's 70th birthday" className="rounded-lg object-cover aspect-video"/>
                <p className="font-semibold text-rose-900">2015: Grandma's 70th Birthday</p>
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
              <p className="text-lg font-serif italic text-rose-900">"What was the best advice your grandmother gave you?"</p>
              <button className="w-full rounded-lg bg-rose-100 py-2 text-rose-800 transition hover:bg-rose-200">Share Your Story</button>
            </div>
          </section>

          {/* "Recent Activity" Widget */}
          <section className="rounded-2xl border border-rose-200/50 bg-white/60 p-6 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <UsersIcon />
              <h2 className="text-xl font-bold text-rose-800">Recent Activity</h2>
            </div>
            <ul className="space-y-3 text-sm text-rose-900">
              <li className="flex items-center gap-2"><span className="font-semibold">Aunt Carol</span> added 5 photos to "Summer BBQ 2024".</li>
              <li className="flex items-center gap-2"><span className="font-semibold">Your cousin, Mike</span> commented on a story.</li>
              <li className="flex items-center gap-2"><span className="font-semibold">Your dad</span> uploaded a video of "First Steps".</li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;