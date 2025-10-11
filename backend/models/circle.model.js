import mongoose from "mongoose";

const circleSchema = new mongoose.Schema({
    circleName: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                if (!v) return false;
                const words = v.trim().split(/\s+/).filter(Boolean);
                return words.length <= 100;
            },
            message: 'Circle name exceeds 100 words.'
        }
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    memberId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    memories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Memory",
        default: []
    }]
}, { timestamps: true });

export const Circle = mongoose.model("Circle", circleSchema)