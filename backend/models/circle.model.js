import mongoose from "mongoose";

const circleSchema = new mongoose.Schema({
    circleName:{
        type: String,
        required: true
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    memberId:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:"User",
    },
    memory:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:"Memory",
        default:[]
    }
},{timestamps:true});

export const Circle = mongoose.model("Circle",circleSchema)