import { Circle } from '../models/circle.model.js';
import { User } from '../models/user.model.js';

// Create a new circle

export const createCircle = async (req, res) => {
    const { circleName, members } = req.body;
    console.log("Request Body:", req.body);
    const ownerId = req.id; // From auth middleware
    try {
        const newCircle = new Circle({ circleName, ownerId, memberId: members });
        await newCircle.save();
        const user = await User.findById(ownerId);
        user.circleId.push(newCircle._id);
        await user.save();
        for (const member of members) {
            const user = await User.findById(member);
            user.circleId.push(newCircle._id);
            await user.save();
        }
        if (!newCircle) {
            return res.status(400).json({
                message: "Failed to create circle",
                success: false
            });
        }

        res.status(201).json({
            message: "Circle created successfully",
            circle: newCircle,
            success: true
        });
    }
    catch (error) {
        console.error("Error creating circle:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getUserCircles = async (req, res) => {
    const userId = req.id;
    try {
        const circleMemberships = User.find({ _id: userId }).select('circleId');
        const circles = await Circle.find({ _id: { $in: circleMemberships } }).populate('owner', 'fullName email').populate('memberId', 'fullName email');
        res.status(200).json({
            circles,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}


