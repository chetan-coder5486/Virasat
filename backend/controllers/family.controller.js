import { User } from '../models/user.model.js';
import { Family } from '../models/family.model.js'; // Assuming you have a Family model
import jwt from 'jsonwebtoken';
import transporter from '../config/mailer.js'; // Import the transporter
import dotenv from 'dotenv';
dotenv.config();


// This should be named createFamily to be more descriptive
export const createFamily = async (req, res) => {
    try {
        // 1. Get the user ID from your authentication middleware.
        // This is the secure source of truth for who the user is.
        const chroniclerId = req.id;

        // 2. Get the family details from the request body.
        // Notice we do NOT get the chronicler from the body.
        const { familyName, description } = req.body;

        // 3. Validate the inputs FIRST.
        if (!familyName || !chroniclerId) {
            return res.status(400).json({
                message: "Family name is required and user must be authenticated.",
                success: false
            });
        }

        // 4. Create the family using the secure chroniclerId.
        const family = await Family.create({
            familyName,
            description,
            chronicler: chroniclerId,
            members: [chroniclerId] // Add the chronicler as the first member
        });

        await family.save();

        // 5. Update the user's document to link them to the new family.
        await User.findByIdAndUpdate(chroniclerId, { family: family._id,
            role:'Chronicler'
         });

        // 6. Send the success response.
        return res.status(201).json({ // Use 201 for resource creation
            message: "Family creation successful",
            success: true,
            family
        });

    } catch (error) {
        console.log(error);
        // Handle potential duplicate familyName error
        if (error.code === 11000) {
            return res.status(409).json({ // 409 Conflict
                message: "A family with this name already exists.",
                success: false
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const sendInvite = async (req, res) => {
    try {
        const { email, role } = req.body;
        // 1. Get the logged-in USER's ID from auth middleware.
        const userId = req.id;

        // 2. Find the user in the database to get their associated family ID.
        const user = await User.findById(userId);
        if (!user || !user.family) {
            return res.status(404).json({ message: "User not found or does not belong to a family.", success: false });
        }
        const familyId1 = user.family;

        // 3. Use the correct familyId to find the family AND populate the chronicler's details.
        const family = await Family.findById(familyId1).populate('chronicler', 'fullName');
        if (!family) {
            return res.status(404).json({ message: "Family not found", success: false });
        }

        // 4. Create the unique invitation token.
        const token = jwt.sign(
            { email, familyId: family._id, role: role || 'Viewer' },
            process.env.JWT_INVITE_KEY,
            { expiresIn: '3d' }
        );

        // 5. Create the invitation URL.
        const inviteLink = `http://localhost:5173/join-family?token=${token}`;

        // 6. Define the email content. Now you can safely access the chronicler's name.
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `You're invited to join the ${family.familyName} Family Trunk!`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Hello!</h2>
                    <p>You have been invited by <strong>${family.chronicler.fullName}</strong> to join the <strong>"${family.familyName}"</strong> Family Trunk.</p>
                    <p>This is a private space to share and preserve your family's stories and memories.</p>
                    <p>To accept your invitation, please click the button below:</p>
                    <a href="${inviteLink}" style="background-color: #db2777; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Join the Family</a>
                    <p>This link will expire in 3 days.</p>
                </div>
            `
        };

        // 7. Send the email.
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: `Invitation sent successfully to ${email}`,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const getFamilyDetails = async (req, res) => {
    try {
        // 1. Get the logged-in user's ID from your auth middleware.
        const userId = req.id;

        // 2. Find the user in the database to get their family ID.
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // 3. Check if the user belongs to a family.
        if (!user.family) {
            return res.status(404).json({
                message: "You do not belong to a family yet.",
                success: false
            });
        }

        // 4. Use the user's family ID to find the actual family document and populate its members.
        const family = await Family.findById(user.family).populate('members', 'fullName email role profile');

        // This check is good practice in case the family was deleted but the user link remains.
        if (!family) {
            return res.status(404).json({
                message: "Family not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Family details fetched successfully",
            success: true,
            family
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const updateFamily = async (req, res) => {
    try {
        const familyId = req.id; // comes from auth middleware
        const { familyName, description } = req.body;
        const family = await Family.findByIdAndUpdate(familyId, { familyName, description }, { new: true });
        if (!family) {
            return res.status(404).json({
                message: "Family not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Family updated successfully",
            success: true,
            family
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const deleteFamily = async (req, res) => {
    try {
        const familyId = req.id; // comes from auth middleware  
        const family = await Family.findByIdAndDelete(familyId);
        if (!family) {
            return res.status(404).json({
                message: "Family not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Family deleted successfully",
            success: true
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const acceptInvite = async (req, res) => {
    try {
        const userId = req.id; // comes from auth middleware
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Token is required", success: false });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_INVITE_KEY);
        } catch (err) {
            return res.status(400).json({ message: "Invalid or expired token.", success: false });
        }

        const { email, familyId, role } = decoded;
        console.log("Decoded invite token:", decoded);

        // Find user by ID and check email matches
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }
        if (user.email !== email) {
            return res.status(403).json({ message: "Invitation not intended for this user.", success: false });
        }

        // Find family and check membership
        const family = await Family.findById(familyId);
        if (!family) {
            return res.status(404).json({ message: "Family not found", success: false });
        }
        if (family.members.includes(userId)) {
            return res.status(400).json({ message: "You are already a member of this family.", success: false });
        }

        // Add user to family members
        family.members.push(userId);
        await family.save();

        // Link user to family and set role
        user.family = family._id;
        user.role = role || 'Viewer';
        await user.save();

        return res.status(200).json({
            message: `Successfully joined the ${family.familyName} family!`,
            success: true,
            family
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}




