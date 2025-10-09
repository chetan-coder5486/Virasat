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
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("USER ID:", req.id);
    let newMemory;

    try {
        const { title, story, date, tags } = req.body;
        const files = req.files;
        const userId = req.id;

        if (!title || !date || files.length === 0) {
            return res.status(400).json({
                message: "Title, date, and atleast one file is required.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 1️⃣ Create placeholder memory
        newMemory = await Memory.create({
            family: user.family,
            author: userId,
            title,
            story,
            date,
            tags: tags ? tags.split(",").map((t) => t.trim()) : [],
            type: "mixed",
            mediaURLs: [], // store array of { url, type }
            status: "processing",
        });

        // 2️⃣ Send immediate response
        res.status(201).json({
            success: true,
            message: "Memory is processing...",
            memory: newMemory,
        });

        // 3️⃣ Background upload of multiple files
        const uploadedResults = await Promise.all(
            files.map((file) =>
                uploadToCloudinary(file, `virasat/${user.family}/memories`)
            )
        );

        // 4️⃣ Update DB with final URLs and types
        const formattedMedia = uploadedResults.map((r) => ({
            url: r.secure_url,
            type: r.resource_type,
        }));

        await Memory.findByIdAndUpdate(newMemory._id, {
            mediaURLs: formattedMedia,
            status: "completed",
        });

        console.log(`✅ Memory ${newMemory._id} updated successfully with all media.`);
    }
    catch (error) {
        if (newMemory && newMemory._id) await Memory.findByIdAndDelete(newMemory._id);
        console.error("❌ Error creating memory:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
