import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { createMemory } from "@/redux/memoryThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { validateMaxWords } from "@/lib/utils";

export const UploadMemoryModal = ({ onClose, circleId = null }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.memories);
  const todayStr = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    title: "",
    story: "",
    date: "",
    tags: "",
    circleId: [],
    memoryFiles: [], // 🔹 Store multiple files
    isMilestone: false,
  });
  const [errors, setErrors] = useState({ title: "", story: "", date: "" });

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
      if (name === "title") {
        const { valid, count } = validateMaxWords(value, 100);
        setErrors((e) => ({
          ...e,
          title: valid
            ? ""
            : `Title has ${count} words. Maximum allowed is 100.`,
        }));
      }
      if (name === "story") {
        const { valid, count } = validateMaxWords(value, 200);
        setErrors((e) => ({
          ...e,
          story: valid
            ? ""
            : `Story has ${count} words. Maximum allowed is 200.`,
        }));
      }
      if (name === "date") {
        const picked = new Date(value);
        const today = new Date(todayStr);
        const invalid = picked > today;
        setErrors((e) => ({
          ...e,
          date: invalid ? "Date cannot be in the future." : "",
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard against invalid title, story, or date
    if (errors.title || errors.story || errors.date) return;
    if (formData.date) {
      const picked = new Date(formData.date);
      const today = new Date(todayStr);
      if (picked > today) return;
    }

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
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              max={todayStr}
              onChange={handleChange}
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          <div>
            <Label htmlFor="story">Story</Label>
            <Textarea id="story" name="story" onChange={handleChange} />
            {errors.story && (
              <p className="mt-1 text-sm text-red-600">{errors.story}</p>
            )}
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
            <Button
              type="button"
              className="cursor-pointer"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                Boolean(errors.title) ||
                Boolean(errors.story) ||
                Boolean(errors.date)
              }
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
