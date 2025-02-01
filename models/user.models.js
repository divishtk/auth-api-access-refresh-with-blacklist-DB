import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passoword: {
        type: String, 
        required:true
    },
    isVerified: {
        type: Number,
        default: 0 // verified -1 
    },
    pic:{
        type: String, 
        required:true

    }
},{
    timestamps:true
})



export const User = mongoose.model("User", UserSchema);