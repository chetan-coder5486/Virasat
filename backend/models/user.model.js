import mongoose from "mongoose";

// Profile sub-schema
const profileSchema = new mongoose.Schema({
  bio: { type: String, default: "" },
  profilePhoto: { type: String, default: "" }, // Profile photo
  dob: { type: Date, default: null }, // Date of Birth
  gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
  location: { type: String, default: "" },
  family: { type: mongoose.Schema.Types.ObjectId, ref: "Family", default: null },
});

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Chronicler", "Contributor", "Viewer"], default: "Viewer", required: true },
    family: { type: mongoose.Schema.Types.ObjectId, ref: "Family", default: null },
    circleId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Circle", default: [] }],
    profile: { type: profileSchema, default: () => ({}) }, // ensures profile object always exists
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
