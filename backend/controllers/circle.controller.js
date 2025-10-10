import { Circle } from '../models/circle.model.js';
import { Memory } from '../models/memory.model.js';
import { User } from '../models/user.model.js';

// Create a new circle

export const createCircle = async (req, res) => {
    const { circleName, members } = req.body;
    const ownerId = req.id;

    try {
        // ✅ Create new circle
        const newCircle = new Circle({ circleName, ownerId, memberId: members });
        await newCircle.save();

        // ✅ Add circle to owner's circle list
        const owner = await User.findById(ownerId);
        owner.circleId.push(newCircle._id);
        await owner.save();

        // ✅ Add circle to each member's list
        for (const member of members) {
            const user = await User.findById(member);
            if (user) {  // ✅ Check if user exists
                user.circleId.push(newCircle._id);
                await user.save();
            }
        }

        return res.status(201).json({
            message: "Circle created successfully",
            circle: newCircle,
            success: true
        });
    } catch (error) {
        console.error("Error creating circle:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


export const getUserCircles = async (req, res) => {
    const userId = req.id;
    try {
        // 1️⃣ Properly await the user fetch
        const user = await User.findById(userId).populate({
            path: 'circleId',
            populate: [
                { path: 'ownerId', select: 'fullName email' },
                { path: 'memberId', select: 'fullName email' }
            ]
        });
        
        // 2️⃣ Defensive check: user might not exist or have no circles
        if (!user || !user.circleId || user.circleId.length === 0) {
            return res.status(200).json({
                circles: [],
                success: true
            });
        }

        // 3️⃣ Now use user.circleId (array of ObjectIds)
        const circles = await Circle.find({ _id: { $in: user.circleId } })
            .populate('ownerId', 'fullName email')      // ✅ use correct field name (ownerId)
            .populate('memberId', 'fullName email');

        return res.status(200).json({
            circles,
            success: true
        });

    } catch (error) {
        console.error("Error fetching user circles:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};



// Additional CRUD operations for circles can be added here (updateCircle, deleteCircle, etc.)



