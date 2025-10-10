import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import { Memory } from "../models/memory.model.js";
import { User } from "../models/user.model.js";
import { Circle } from "../models/circle.model.js";
// removed tmp-file approach; stream uploads are sufficient for current sizes

// 🔹 Helpers: sleep and robust Cloudinary upload (with video large-stream and retries)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const uploadToCloudinary = async (file, folder) => {
    const isVideo = (file.mimetype || "").startsWith("video/");
    const options = {
        folder,
        resource_type: isVideo ? "video" : "image",
        timeout: 600000, // 10 minutes
        // You can tune these if needed:
        // eager_async: true,
    };

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};

const uploadWithRetry = async (file, folder, maxRetries = 3) => {
    let attempt = 0;
    while (true) {
        try {
            return await uploadToCloudinary(file, folder);
        } catch (err) {
            attempt += 1;
            if (attempt > maxRetries) throw err;
            const backoff = 500 * Math.pow(2, attempt - 1); // 500ms, 1s, 2s
            console.warn(`Cloudinary upload failed (attempt ${attempt}/${maxRetries}). Retrying in ${backoff}ms...`, err?.message || err);
            await sleep(backoff);
        }
    }
};

// 🔹 Create memory (with "processing" status but no retry logic)
export const createMemory = async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("USER ID:", req.id);
    let newMemory;

    try {
        const { title, story, date, tags, circleId, isMilestone } = req.body;
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
            circleId: circleId ? circleId : null,
            mediaURLs: [], // store array of { url, type }
            status: "processing",
            isMilestone: isMilestone === 'true'
        });

        if (circleId) {
            let circle = await Circle.findById(circleId);
            if (circle) {
                circle.memories.push(newMemory._id);
                await circle.save();
            }
        }

        // 2️⃣ Send immediate response so the client doesn't wait on uploads
        res.status(201).json({
            success: true,
            message: "Memory is processing...",
            memory: newMemory,
        });

        // 3️⃣ Background task: upload files with retry and update DB when done
        (async () => {
            try {
                const folder = `virasat/${user.family}/memories`;
                const uploadedResults = [];
                // Process sequentially to reduce bandwidth spikes (tune as needed)
                for (const file of files) {
                    const result = await uploadWithRetry(file, folder, 3);
                    uploadedResults.push(result);
                }

                const formattedMedia = uploadedResults.map((r) => ({
                    url: r.secure_url,
                    type: r.resource_type,
                }));

                await Memory.findByIdAndUpdate(newMemory._id, {
                    mediaURLs: formattedMedia,
                    status: "completed",
                });

                console.log(`✅ Memory ${newMemory._id} updated successfully with all media.`);
            } catch (bgErr) {
                console.error("❌ Background upload failed for memory:", newMemory?._id, bgErr);
                // Mark memory as failed rather than deleting; keeps user feedback visible
                if (newMemory && newMemory._id) {
                    await Memory.findByIdAndUpdate(newMemory._id, { status: "failed" });
                }
            }
        })();
    }
    catch (error) {
        // If we fail before responding, clean up and return an error
        if (newMemory && newMemory._id) await Memory.findByIdAndDelete(newMemory._id);
        console.error("❌ Error creating memory:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTimelineEvents = async (req, res) => {
    try {
        const user = req.user; // From isAuthenticated middleware
        const { sort } = req.query;
        const sortOrder = sort === 'desc' ? 'desc' : 'asc';

        // Find all milestone memories for the user's family that are NOT tied to any circle
        // i.e., exclude those where circleId exists (circle-specific memories)
        const timelineEvents = await Memory.find({
            family: user.family,
            isMilestone: true,
            $or: [
                { circleId: undefined },
                { circleId: { $exists: false } }
            ]
        })
            .populate('author', 'fullName') // Get author details
            .sort({ date: sortOrder }); // Sort by date

        return res.status(200).json({
            success: true,
            events: timelineEvents
        });

    } catch (error) {
        console.log("Error fetching timeline events:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
