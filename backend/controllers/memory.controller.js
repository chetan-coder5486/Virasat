import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import { Memory } from "../models/memory.model.js";
import { User } from "../models/user.model.js";

// 🔹 Basic upload to Cloudinary (no retry)
const uploadToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};

// 🔹 Create memory (with "processing" status but no retry logic)
export const createMemory = async (req, res) => {
    let newMemory;

    try {
        const { title, story, date, tags } = req.body;
        const file = req.file;
        const userId = req.id;

        if (!title || !date || !file) {
            return res.status(400).json({
                message: "Title, date, and a file are required.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 1️⃣ Create memory with 'processing' status
        newMemory = await Memory.create({
            family: user.family,
            author: userId,
            title,
            story,
            date,
            tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
            type: file.mimetype.startsWith("video") ? "video" : "photo",
            mediaUrl: "placeholder-url",
            status: "processing",
        });

        // 2️⃣ Populate author info
        const populatedMemory = await Memory.findById(newMemory._id)
            .populate("author", "fullName")
            .lean();

        // Step 3: If still missing fullName, assign manually (safety net)
        if (!populatedMemory.author?.fullName) {
            populatedMemory.author = { _id: userId, fullName: user.fullName };
        }

        // 3️⃣ Send immediate response to frontend
        res.status(201).json({
            success: true,
            message: "Memory is processing...",
            memory: populatedMemory,
        });

        // 4️⃣ Background upload (no retry)
        try {
            const cloudinaryResponse = await uploadToCloudinary(
                file,
                `virasat/${user.family}/memories`
            );

            // 5️⃣ Update memory after successful upload
            await Memory.findByIdAndUpdate(newMemory._id, {
                mediaUrl: cloudinaryResponse.secure_url,
                status: "completed",
            });
            

            console.log(
                `✅ Memory ${newMemory._id} updated successfully with media URL.`
            );
        } catch (uploadError) {
            console.error("❌ Cloudinary upload failed:", uploadError.message);
            await Memory.findByIdAndDelete(newMemory._id);
            console.log(`🗑️ Removed failed memory record: ${newMemory._id}`);
        }
    } catch (error) {
        if (newMemory && newMemory._id) {
            await Memory.findByIdAndDelete(newMemory._id);
        }
        console.error("Error creating memory:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
