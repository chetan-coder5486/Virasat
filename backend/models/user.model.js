import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['Chronicler','Member'],
        default:'Member',
        required: true
    },
    profile:{
        bio:{type: String},
        family:{type:mongoose.Schema.Types.ObjectId, ref:"Family"},
        profilePhoto:{
            type:String,
            default:""
        } 
    },
},{timestamps:true});

export const User = mongoose.model("User", userSchema);