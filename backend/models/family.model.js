import mongoose from 'mongoose'

const familySchema = new mongoose.Schema({
    familyName:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
    },
    chronicler:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }] 
       
},{timestamps:true})

export const Family = mongoose.model("Family",familySchema)
  