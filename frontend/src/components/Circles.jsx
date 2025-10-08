import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import Navbar from "./shared/Navbar";
import { useSelector } from "react-redux";

// --- Mock Data (In a real app, this would come from your Redux store or an API call) ---


const CircleItem = ({ circle }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="flex items-center p-3 space-x-4 hover:bg-rose-100/50 rounded-lg cursor-pointer transition-colors"
  >
    <Avatar className="h-12 w-12 border-2 border-rose-100">
      <AvatarImage src={circle.avatarUrl} alt={circle.circleName} />
      <AvatarFallback className="bg-rose-200 text-rose-700">
        {circle.circleName[0]}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <p className="text-md font-semibold text-rose-900 truncate">
          {circle.name}
        </p>
        {/* {/* <p className="text-xs text-rose-500">{circle.timestamp}</p> */}
      </div>
      {/* <div className="flex justify-between items-center mt-1">
        <p className="text-sm text-rose-700 truncate">{circle.lastActivity}</p>
        {circle.unreadCount > 0 && (
          <Badge className="bg-green-600 text-white">
            {circle.unreadCount}
          </Badge>
        )}
      </div> */} 
    </div>
  </motion.div>
);

export default function Circles() {
  const [searchTerm, setSearchTerm] = useState("");

  const {items} = useSelector(state=>(state.circle))

  const filteredCircles = useMemo(
    () =>
      items.filter((circle) =>
        circle.circleName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 p-4 sm:p-6 lg:p-8 flex justify-center">
        <motion.div
          className="w-full max-w-lg bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-rose-200/50 flex flex-col"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
          <header className="p-4 border-b border-rose-200/80 flex justify-between items-center">
            <h1 className="text-2xl font-bold font-serif text-rose-800">
              Your Circles
            </h1>
            <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
              <Plus className="h-4 w-4" />
            </Button>
          </header>

          {/* Search Bar */}
          <div className="p-4 border-b border-rose-200/80">
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

          {/* Circles List */}
          <div className="flex-1 overflow-y-auto p-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredCircles.map((circle) => (
                  <CircleItem key={circle.id} circle={circle} />
                ))}
              </AnimatePresence>
            </motion.div>
            {!filteredCircles.length && (
              <p className="text-center text-rose-600 p-8">No circles found.</p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
