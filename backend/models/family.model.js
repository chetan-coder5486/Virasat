import mongoose from 'mongoose'

const familySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
    },
    chronicler:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },    
},{timestamps:true})

export const Family = mongoose.model("Family",familySchema)
  