import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: "User not Authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_AUTH_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }

    // Find the user in the database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Attach minimal user info to req.user
    req.user = { userId: user._id, ...user._doc }; // _doc contains the document fields
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in isAuthenticated middleware:", error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;
