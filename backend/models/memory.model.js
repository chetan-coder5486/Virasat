import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['photo', 'video', 'mixed', 'other'], // ✅ added 'mixed' for multiple file types
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        required: true
    },

    // ✅ Store multiple media objects (URL + type)
    mediaURLs: [
        {
            url: { type: String, required: true },
            type: { type: String, enum: ["image", "video", "audio", "other"], default: "image" }
        }
    ],

    // ✅ Optional: extracted audio URLs (future support)
    audioUrls: {
        type: [String],
        default: []
    },

    date: {
        type: Date,
        required: true
    },
    tags: {
        type: [String],
        index: true
    },
    aitags: {
        type: [String],
        index: true
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing'
    },
    circleId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Memory",
        default: []
    }]
}, { timestamps: true });

export const Memory = mongoose.model("Memory", memorySchema);
