import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password } = req.body;
        if (!fullName || !email || !phoneNumber || !password) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: "User already exists with this email.",
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.JWT_AUTH_KEY, { expiresIn: '1d' });

        const loggedUser = await User.findById(user._id).populate('family');
        const isFamily = loggedUser.family && loggedUser.family.toString().trim() !== "" ? true : false;

        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome back, ${user.fullName}`,
                user: userResponse,
                success: true,
                isFamily: isFamily,
                family: loggedUser.family || null,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error during logout.",
            success: false,
        });
    }
};

export const verifyInvite = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token is required", success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_INVITE_KEY);
        return res.status(200).json({
            message: "Token is valid",
            success: true,
            data: decoded,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
        });
    }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId; // auth middleware
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: No user found.",
        success: false,
      });
    }

    const { fullName, phoneNumber, bio, dob, gender, location } = req.body;
    const updates = {
      ...(fullName && { fullName }),
      ...(phoneNumber && { phoneNumber }),
      ...(bio && { "profile.bio": bio }),
      ...(dob && { "profile.dob": dob }),
      ...(gender && { "profile.gender": gender }),
      ...(location && { "profile.location": location }),
    };

    // Handle uploaded profile photo
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'profiles' },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({
              message: "Failed to upload profile photo",
              success: false,
            });
          }
          updates["profile.profilePhoto"] = result.secure_url;

          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
          );

          return res.status(200).json({
            message: "Profile updated successfully.",
            success: true,
            user: updatedUser,
          });
        }
      );

      // Pipe file buffer to Cloudinary
      result.end(req.file.buffer);
      return;
    }

    // If no profile photo uploaded
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error updating user profile:", error);
    return res.status(500).json({
      message: "Failed to update profile.",
      success: false,
    });
  }
};