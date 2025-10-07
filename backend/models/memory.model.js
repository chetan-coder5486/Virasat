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
<<<<<<< HEAD
        enum:['photo','video','other'],
=======
        enum:['Photo','Video','Text'],
>>>>>>> 39dbe1ea1c50897f39e9aa49b0373cb084aaad8f
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
<<<<<<< HEAD
    date:{
=======
    dateOfEvent:{
>>>>>>> 39dbe1ea1c50897f39e9aa49b0373cb084aaad8f
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
<<<<<<< HEAD
    },
    status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  }
},{timestamps:true});

export const Memory = mongoose.model("Memory", memorySchema);
=======
    }
},{timestamps:true});

export const Memory = mongoose.model("Memory", memorySchema);
>>>>>>> 39dbe1ea1c50897f39e9aa49b0373cb084aaad8f
