import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, MessageSquare, Settings, Loader2 } from "lucide-react";
import Navbar from "./shared/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { CreateCircleModal } from "./CreateCircleModal";
import { UploadMemoryModal } from "./UploadMemoryModal";
import { MemoryDetailModal } from "./Memories"; // Assuming MemoryDetailModal is in Memories.jsx
import { fetchMemories } from "@/redux/memoryThunks";
import { setActiveCircleId } from "@/redux/circleSlice";

// ====================================================================
// Sub-Components
// ====================================================================

const CircleListItem = ({ circle, isSelected, onSelect }) => {
  const dispatch = useDispatch();

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => dispatch(setActiveCircleId(circle._id))}
      className={`flex items-center p-3 space-x-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-green-200/60" : "hover:bg-green-100/50"
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <Avatar className="h-11 w-11 border-2 border-white">
        {/* Assuming an avatarUrl property for circles, otherwise fallback */}
        <AvatarImage src={circle.avatarUrl} alt={circle.circleName} />
        <AvatarFallback className="bg-rose-200 text-rose-700">
          {circle.circleName ? circle.circleName[0] : "C"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-md font-semibold text-rose-900 truncate">
          {circle.circleName}
        </p>
        <p className="text-sm text-rose-600 truncate">
          {circle.memberId.length} members
        </p>
      </div>
    </motion.div>
  );
};

const CircleMemoryCard = ({ memory, onCardClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.2 }}
    onClick={() => onCardClick(memory)}
    className="bg-white/80 rounded-lg shadow-md overflow-hidden cursor-pointer"
  >
    <div className="relative w-full h-40 overflow-hidden">
      {(() => {
        // Support both memory.mediaURLs (array) and legacy memory.mediaUrl (string)
        const first = Array.isArray(memory.mediaURLs)
          ? memory.mediaURLs[0]
          : memory.mediaUrl
          ? {
              url: memory.mediaUrl,
              type:
                memory.mediaUrl.endsWith(".mp4") ||
                memory.mediaUrl.endsWith(".webm")
                  ? "video"
                  : "image",
            }
          : null;
        if (!first) return null;
        if (first.type === "video") {
          return (
            <div className="relative w-full h-full">
              <video
                src={first.url}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/40 rounded-full p-2">
                  {/* simple play triangle */}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7-11-7z" fill="#fff" />
                  </svg>
                </div>
              </div>
            </div>
          );
        }
        return (
          <img
            src={first.url}
            alt={memory.title}
            className="w-full h-full object-cover"
          />
        );
      })()}
    </div>
    <div className="p-3">
      <h4 className="font-semibold font-serif text-rose-800 truncate">
        {memory.title}
      </h4>
      <p className="text-xs text-rose-600">by {memory.author.fullName}</p>
    </div>
  </motion.div>
);

const CircleDetail = ({
  circle,
  memories,
  loading,
  onShareClick,
  onMemoryClick,
}) => (
  <motion.div
    key={circle._id}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col h-full"
  >
    {/* Header */}
    <header className="p-4 border-b border-rose-200/80 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-white">
          <AvatarImage src={circle.avatarUrl} alt={circle.circleName} />
          <AvatarFallback className="bg-rose-200 text-rose-700">
            {circle.circleName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold font-serif text-rose-800">
            {circle.circleName}
          </h2>
          <p className="text-sm text-rose-600">
            {circle.memberId.length} members
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5 text-rose-600" />
      </Button>
    </header>

    {/* Memories Content Area */}
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
        </div>
      ) : memories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {memories.map((memory) => (
            <CircleMemoryCard
              key={memory._id}
              memory={memory}
              onCardClick={onMemoryClick}
            />
          ))}
        </div>
      ) : (
        <div className="h-full text-center flex flex-col justify-center items-center">
          <MessageSquare className="h-16 w-16 text-rose-300 mb-4" />
          <h3 className="text-xl font-semibold text-rose-700">
            No Memories Yet
          </h3>
          <p className="text-rose-500 max-w-xs mt-2">
            Be the first to share a story, photo, or memory in the "
            {circle.circleName}" circle.
          </p>
        </div>
      )}
    </div>

    {/* Footer / Action Bar */}
    <footer className="p-4 border-t border-rose-200/80">
      <Button
        onClick={onShareClick}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Plus className="mr-2 h-4 w-4" /> Share a Memory in this Circle
      </Button>
    </footer>
  </motion.div>
);

// ====================================================================
// Main Circles Component
// ====================================================================
export default function Circles() {
  const dispatch = useDispatch();
  const {
    items: circles = [],
    loading: circlesLoading,
    activeCircleId,
  } = useSelector((state) => state.circle);
  const { familyData } = useSelector((state) => state.family);
  const { items: memories, loading: memoriesLoading } = useSelector(
    (state) => state.memories
  );

  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCircle = useMemo(
    () => circles.find((c) => c._id === activeCircleId) ?? null,
    [circles, activeCircleId]
  );

  // Effect to select the first circle by default
  useEffect(() => {
    if (!activeCircleId && circles.length > 0) {
      dispatch(setActiveCircleId(circles[0]._id ?? circles[0]._id));
      // note: prefer _id. if your circle uses a different id field adjust.
    }
  }, [circles, activeCircleId, dispatch]);

  // Effect to fetch memories for the selected circle
  useEffect(() => {
    if (selectedCircle) {
      dispatch(
        fetchMemories({
          searchTerm: "",
          filters: {},
          circleId: selectedCircle._id,
        })
      );
    }
  }, [selectedCircle, dispatch]);

  const filteredCircles = useMemo(() => {
    if (!circles) return [];
    return circles.filter((circle) =>
      circle.circleName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [circles, searchTerm]);

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* --- Sidebar (Left Column) --- */}
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col border-r border-rose-200/60 bg-white/40">
          <header className="p-4 border-b border-rose-200/80 flex justify-between items-center">
            <h1 className="text-2xl font-bold font-serif text-rose-800">
              Your Circles
            </h1>
            <Button
              onClick={() => setIsCircleModalOpen(true)}
              size="icon"
              className="bg-rose-600 hover:bg-rose-700 h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </header>
          <div className="p-3 border-b border-rose-200/80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-400" />
              <Input
                type="text"
                placeholder="Search circles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-rose-50/50 border-rose-200 focus-visible:ring-rose-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <AnimatePresence>
              {filteredCircles.map((circle) => (
                <CircleListItem
                  key={circle._id}
                  circle={circle}
                  isSelected={selectedCircle?._id === circle._id}
                  onSelect={() => dispatch(setActiveCircleId(circle._id))}
                />
              ))}
            </AnimatePresence>
            {circlesLoading && (
              <p className="text-center text-rose-600 p-4">Loading...</p>
            )}
          </div>
        </aside>

        {/* --- Main Content (Right Column) --- */}
        <main className="flex-1 h-full bg-white/60 backdrop-blur-md">
          <AnimatePresence mode="wait">
            {selectedCircle ? (
              <CircleDetail
                key={selectedCircle._id}
                circle={selectedCircle}
                memories={memories}
                loading={memoriesLoading}
                onShareClick={() => setIsUploadModalOpen(true)}
                onMemoryClick={setSelectedMemory}
              />
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-rose-600">
                <MessageSquare className="h-12 w-12 text-rose-300 mb-4" />
                <h2 className="text-xl font-semibold">Select a circle</h2>
                <p>Choose a circle from the left to view its content.</p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {isUploadModalOpen && selectedCircle && (
          <UploadMemoryModal
            onClose={() => setIsUploadModalOpen(false)}
            circleId={selectedCircle._id}
          />
        )}
        {isCircleModalOpen && (
          <CreateCircleModal
            isOpen={isCircleModalOpen}
            onClose={() => setIsCircleModalOpen(false)}
            familyMembers={familyData?.members || []}
          />
        )}
        {selectedMemory && (
          <MemoryDetailModal
            memory={selectedMemory}
            onClose={() => setSelectedMemory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
