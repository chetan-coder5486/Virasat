import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        console.log("Register endpoint hit with data:", req.body);
        const { fullName, email, phoneNumber, password} = req.body
        if (!fullName || !email || !phoneNumber || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exist with this email",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role:'Member'
        })
        return res.status(200).json({
            message: "account created succcessfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "Somehing is missing",
                success: false
            })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.JWT_AUTH_KEY, { expiresIn: '1d' });

        user = {
            __id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullName}`,
            user,
            success: true
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Server error",
            success:false
        })
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }

}

// export const updateProfile = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, bio, skills } = req.body;
//         const file = req.file;
//         const userId = req.id; // comes from auth middleware
//         let user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//                 success: false
//             });
//         }

//         //cloudinery 



//         // Update only if provided
//         if (fullname) user.fullname = fullname;
//         if (email) user.email = email;
//         if (phoneNumber) user.phoneNumber = phoneNumber;
//         if (bio) user.profile.bio = bio;
//         if (skills) user.profile.skills = skills.split(",").map(skill => skill.trim());

//         await user.save();

//         user = {
//             _id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             role: user.role,
//             profile: user.profile
//         };

//         return res.status(200).json({
//             message: "Profile updated successfully",
//             success: true,
//             user
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };
