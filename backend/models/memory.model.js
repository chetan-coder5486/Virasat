import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                if (!v) return false;
                const words = v.trim().split(/\s+/).filter(Boolean);
                return words.length <= 100;
            },
            message: 'Title exceeds 100 words.'
        }
    },
    story: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                const words = String(v || '').trim().split(/\s+/).filter(Boolean);
                return words.length <= 200;
            },
            message: 'Story exceeds 200 words.'
        }
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
        required: true,
        validate: {
            validator: function (v) {
                if (!v) return false;
                return v <= new Date();
            },
            message: 'Event date cannot be in the future.'
        }
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
    circleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Circle",
        default: undefined
    },
    isMilestone: {
        type: Boolean,
        default: false // Most memories are not milestones
    }
}, { timestamps: true });

export const Memory = mongoose.model("Memory", memorySchema);
