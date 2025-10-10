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
        enum:['Chronicler','Contributor','Viewer'],
        default:'Viewer',
        required: true
    },
    family:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Family",
        default:null
    },
    circleId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Circle",
        default:[]
    }],
    profile:{
        bio:{type: String},
        family:{type:mongoose.Schema.Types.ObjectId, ref:"Family"},
        profilePhoto:{
            type:String,
            default:""
        } 
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    otp:{
        type:String,
    },
    otpExpiry:{
        type:Date,
    }
},{timestamps:true});

export const User = mongoose.model("User", userSchema);