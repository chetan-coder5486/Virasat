import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    story:{
        type: String,
        required: true
    },
    type:{
        type: String,
        enum:['photo','video','other'],
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    family:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        required: true
    },
    mediaUrl:{
        type: String,
        default: ""
    },
    date:{
        type: Date,
        required: true
    },
    tags:{
        type: [String],
        index: true
    },
    aitags:{
        type: [String],
        index: true
    },
    status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  }
},{timestamps:true});

export const Memory = mongoose.model("Memory", memorySchema);
