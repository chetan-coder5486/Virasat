import React from 'react';
import  { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { UploadMemoryModal } from '@/components/UploadMemoryModal';
import { PlusCircle } from "lucide-react";
import { fetchMemories } from "@/redux/memoryThunks"; // Your Redux thunk
import { FAMILY_API_ENDPOINT } from "@/utils/constant";
import Navbar from "./shared/Navbar";

// ====================================================================
// 1. Tag Autocomplete Component (Backend-powered & Debounced)
// ====================================================================
const TagAutocomplete = ({ onTagSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useCallback(async (prefix) => {
    if (!prefix) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${FAMILY_API_ENDPOINT}/tags/autocomplete`,
        {
          params: { prefix },
          withCredentials: true,
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Failed to fetch tag suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue, fetchSuggestions]);

  const handleSelect = (tag) => {
    onTagSelect(tag);
    setInputValue(tag); // Show the selected tag in the input
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Filter by tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>
      {suggestions.length > 0 && (
        <motion.ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((tag) => (
            <li
              key={tag}
              onClick={() => handleSelect(tag)}
              className="px-4 py-2 cursor-pointer hover:bg-rose-50"
            >
              {tag}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

// ====================================================================
// 2. Filter Bar Component
// ====================================================================
const FilterBar = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onTagSelect,
}) => (
  <motion.div
    className="mb-8 p-4 bg-white/60 backdrop-blur-md rounded-xl shadow-md"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="Search memories..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full p-2 border border-rose-200 rounded-lg"
      />
      <select
        name="type"
        value={filters.type}
        onChange={onFilterChange}
        className="p-2 border border-rose-200 rounded-lg"
      >
        <option value="all">All Types</option>
        <option value="photo">Photos</option>
        <option value="video">Videos</option>
        <option value="story">Stories</option>
      </select>
      <select
        name="member"
        value={filters.member}
        onChange={onFilterChange}
        className="p-2 border border-rose-200 rounded-lg"
      >
        <option value="all">All Members</option>
        {/* In a real app, you would fetch a list of members for this dropdown */}
        <option value="You (User)">You (User)</option>
        <option value="Sarah Miller">Sarah Miller</option>
      </select>
      <TagAutocomplete onTagSelect={onTagSelect} />
    </div>
  </motion.div>
);

// ====================================================================
// 3. Memory Card and Modal Components
// ====================================================================

const MemoryCard = ({ memory, onCardClick }) => {
  // 1. Check if the memory is still processing
  const isProcessing = memory.status === 'processing';

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      // 2. Add conditional classes and onClick handler
      className={`bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col ${
        isProcessing ? 'cursor-not-allowed filter grayscale' : 'cursor-pointer'
      }`}
      onClick={() => !isProcessing && onCardClick(memory)}
    >
      <div className="relative w-full h-48">
        {/* 3. Show a placeholder or the actual media URL */}
        <img
          src={isProcessing ? 'https://placehold.co/600x400/fecdd3/b91c1c?text=Processing...' : memory.mediaUrl}
          alt={memory.title}
          className="w-full h-full object-cover"
        />
        {/* 4. Show a spinner overlay if processing */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold font-serif text-rose-800">
          {memory.title}
        </h3>
        <p className="text-sm text-rose-600">
          {/* Use optional chaining in case author is not yet populated */}
          {memory.author?.fullName || '...'} - {new Date(memory.date).toLocaleDateString()}
        </p>
        <div className="mt-2 flex flex-wrap gap-1 pt-2 border-t border-rose-100 flex-grow content-start">
          {memory.tags?.map((tag) => (
            <span key={tag} className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};



export const MemoryDetailModal = ({ memory, onClose }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="w-full max-w-3xl bg-white rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-2xl font-bold text-rose-700"
      >
        &times;
      </button>
      <h2 className="text-3xl font-bold font-serif text-rose-800 mb-2">
        {memory.title}
      </h2>
      <p className="text-md text-rose-600 mb-4">
        {memory.author.fullName} - {new Date(memory.date).toLocaleDateString()}
      </p>

      {/* --- THIS IS THE FIX --- */}
      <div className="w-full max-h-96 flex justify-center items-center bg-gray-100 rounded-lg mb-4">
        {memory.type === 'video' ? (
          <video
            src={memory.mediaUrl}
            controls // Show video controls (play, pause, volume)
            autoPlay // Optional: start playing automatically
            className="max-w-full max-h-96 rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={memory.mediaUrl}
            alt={memory.title}
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        )}
      </div>
      {/* -------------------- */}
      
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {memory.story}
      </p>
      {/* Comments section would go here */}
    </motion.div>
  </motion.div>
);

// ====================================================================
// 4. Main Archive Page Component
// ====================================================================
export default function ArchivePage() {
  const dispatch = useDispatch();
  const { items: memories, loading } = useSelector((state) => state.memories);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "all", member: "all", tag: "all" });
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(fetchMemories({ searchTerm, filters }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, filters, dispatch]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
      <Navbar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* FIX 1: Add a persistent "Add Memory" button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold font-serif text-rose-800">The Archive</h1>
          <motion.button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-md font-medium text-white shadow-lg transition-colors duration-300 hover:bg-rose-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusCircle size={20} />
            Add Memory
          </motion.button>
        </div>

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          filters={filters}
          onFilterChange={(e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          onTagSelect={(tag) => setFilters((prev) => ({ ...prev, tag }))}
        />

        {loading && memories.length === 0 ? (
          <div className="flex justify-center items-center mt-16">
            <Loader2 className="h-12 w-12 text-rose-500 animate-spin" />
          </div>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {memories.map((memory) => (
                  <MemoryCard key={memory._id} memory={memory} onCardClick={setSelectedMemory} />
                ))}
              </AnimatePresence>
            </motion.div>

            {!loading && memories.length === 0 && (
              <div className="text-center mt-16">
                <h3 className="text-2xl font-semibold text-rose-800">Your Archive is Empty</h3>
                <p className="text-rose-600 mt-2 mb-6">
                  Start preserving your family's history by adding your first memory.
                </p>
                {/* The main button is now in the header, so this is a simplified CTA */}
                <motion.button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-4 text-lg font-medium text-white shadow-lg"
                >
                  <PlusCircle />
                  Upload a Memory
                </motion.button>
              </div>
            )}
          </>
        )}
      </main>

      {/* FIX 2: Move modal presence checks to the top level */}
      <AnimatePresence>
        {isUploadModalOpen && <UploadMemoryModal onClose={() => setIsUploadModalOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedMemory && <MemoryDetailModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />}
      </AnimatePresence>
    </div>
  );
}