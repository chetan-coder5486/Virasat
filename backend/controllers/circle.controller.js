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
        // Fetch user and populate circle details (owner and members)
        const user = await User.findById(userId).populate({
            path: 'circleId',
            populate: [
                { path: 'ownerId', select: 'fullName email' },
                { path: 'memberId', select: 'fullName email' }
            ]
        });

        if (!user || !Array.isArray(user.circleId) || user.circleId.length === 0) {
            return res.status(200).json({ circles: [], success: true });
        }

        // user.circleId is already an array of populated Circle docs; return as-is
        return res.status(200).json({ circles: user.circleId, success: true });
    } catch (error) {
        console.error("Error fetching user circles:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};



// Update a circle (rename) - only the owner can update
export const updateCircle = async (req, res) => {
    const userId = req.id;
    const { id } = req.params;
    const { circleName } = req.body;

    try {
        const circle = await Circle.findById(id);
        if (!circle) {
            return res.status(404).json({ success: false, message: 'Circle not found' });
        }

        if (String(circle.ownerId) !== String(userId)) {
            return res.status(403).json({ success: false, message: 'Only the owner can rename this circle' });
        }

        if (circleName && circleName.trim().length > 0) {
            circle.circleName = circleName.trim();
        }

        await circle.save();

        const populated = await Circle.findById(circle._id)
            .populate('ownerId', 'fullName email')
            .populate('memberId', 'fullName email');

        return res.status(200).json({ success: true, circle: populated });
    } catch (error) {
        console.error('Error updating circle:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



