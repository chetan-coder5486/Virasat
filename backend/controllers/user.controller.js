import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
            return res.status(409).json({ // IMPROVEMENT: Use 409 Conflict for existing resources
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

        // IMPROVEMENT: Use 201 Created for successful resource creation
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        // FIX: Added a return statement to send an error response to the client
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
            // FIX: Corrected typo "Somehing"
            return res.status(400).json({
                message: "Something is missing.",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ // IMPROVEMENT: Use 401 Unauthorized for bad credentials
                message: "Incorrect email or password.",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ // IMPROVEMENT: Use 401 Unauthorized for bad credentials
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id,
        };
        const token = jwt.sign(tokenData, process.env.JWT_AUTH_KEY, { expiresIn: '1d' });

        // FIX: This is the crucial step for persistence. Check if the user has a family.
        const loggedUser = await User.findById(user._id).populate('family');
        const isFamily = loggedUser.family && loggedUser.family.toString().trim() !== "" ? true : false;

        console.log("User family field:", loggedUser.family);
        console.log("Is family calculated as:", isFamily);


        // IMPROVEMENT: Create a safe user object to return, excluding the password.
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
                isFamily: isFamily, // FIX: Send the isFamily status to the frontend
                family: loggedUser.family || null,   // ✅ Add this line
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
        // FIX: Added a return statement to handle unexpected errors
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
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_INVITE_KEY);
        return res.status(200).json({
            message: "Token is valid",
            success: true,
            data: decoded // Contains email, familyId, role, iat, exp
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}


