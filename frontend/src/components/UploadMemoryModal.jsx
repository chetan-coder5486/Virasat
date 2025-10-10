import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { createMemory } from "@/redux/memoryThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const UploadMemoryModal = ({ onClose, circleId = null }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.memories);

  const [formData, setFormData] = useState({
    title: "",
    story: "",
    date: "",
    tags: "",
    circleId: [],
    memoryFiles: [], // 🔹 Store multiple files
    isMilestone: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "memoryFiles") {
      // 🔹 Convert FileList to Array for multiple files
      setFormData((prev) => ({
        ...prev,
        memoryFiles: Array.from(files),
      }));
    } else if (type === "checkbox") {
      // 2. Handle the checkbox change
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("story", formData.story);
    data.append("date", formData.date);
    data.append("tags", formData.tags);
    data.append("isMilestone", formData.isMilestone);
    if (circleId) {
      data.append("circleId", circleId);
    }

    // 🔹 Append all selected files
    formData.memoryFiles.forEach((file) => {
      data.append("memoryFiles", file);
    });

    try {
      await dispatch(createMemory(data)).unwrap();
      onClose(); // close modal if upload succeeds
    } catch (error) {
      console.error("Failed to create memory:", error);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold font-serif text-rose-800 mb-4">
          Add a New Memory
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="story">Story</Label>
            <Textarea id="story" name="story" onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="memoryFiles">Photos or Videos</Label>
            <Input
              id="memoryFiles"
              name="memoryFiles"
              type="file"
              multiple // ✅ allow multiple uploads
              accept="image/*,video/*"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="isMilestone"
              name="isMilestone"
              type="checkbox"
              checked={formData.isMilestone}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            <Label
              htmlFor="isMilestone"
              className="text-sm font-medium text-rose-800"
            >
              Mark as a milestone (e.g., birth, wedding)
            </Label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" className="cursor-pointer" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Memory
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
