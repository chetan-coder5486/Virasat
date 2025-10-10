import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"User not Authenticated",
                success:false
            })
        }
        const decode  = jwt.verify(token,process.env.JWT_AUTH_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid Token",
                success:false
            })
        }

        // Find the user in the database using the ID from the token
        const user = await User.findById(decode.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Attach the full user object to the request
        req.user = user;
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log('Error in isAuthenticated middleware:', error);
        console.log(error)
    }
}

export default isAuthenticated