import {User} from '../models/user.model.js'; 
import {Family} from '../models/family.model.js'; // Assuming you have a Family model
import jwt from 'jsonwebtoken';
import transporter from '../config/mailer.js'; // Import the transporter

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

        // 5. Update the user's document to link them to the new family.
        await User.findByIdAndUpdate(chroniclerId, { family: family._id });

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
        const { email, role } = req.body; // You can also pass the role in the invite
        const familyId = req.id; // comes from auth middleware

        // 1. Find the family and chronicler who is sending the invite
        const family = await Family.findById(familyId).populate('chronicler', 'familyName');
        if (!family) {
            return res.status(404).json({ message: "Family not found", success: false });
        }
        
        // 2. Create a unique invitation token
        // This token will contain the email to be invited and the family it's for.
        // It's set to expire in 3 days for security.
        const token = jwt.sign(
            { email, familyId, role: role || 'Viewer' }, 
            process.env.JWT_INVITE_KEY, 
            { expiresIn: '3d' }
        );

        // 3. Create the invitation URL
        // This URL points to a frontend page that will handle token verification
        const inviteLink = `http://localhost:5173/join-family?token=${token}`;

        // 4. Define the email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `You're invited to join the ${family.familyName} Family Trunk!`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Hello!</h2>
                    <p>You have been invited by <strong>${family.chronicler.fullName}</strong> to join the <strong>"${family.familyName}"</strong> Family Trunk.</p>
                    <p>Family Trunk is a private space to share and preserve your family's stories and memories.</p>
                    <p>To accept your invitation, please click the button below:</p>
                    <a href="${inviteLink}" style="background-color: #A58D78; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Join the Family</a>
                    <p>This link will expire in 3 days.</p>
                    <p>We look forward to sharing memories with you!</p>
                </div>
            `
        };

        // 5. Send the email
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
}
export const getFamilyDetails = async (req, res) => {
    try {
        const familyId = req.id; // comes from auth middleware  
        const family = await Family.findById(familyId).populate('members', 'fullName email role profile');

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
        console.log(error)
        return res.status(500).json({   
            message: "Internal Server Error",
            success: false
        })
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

export const acceptInvite = async (req, res) => {
    try {
        const userId = req.id; // comes from auth middleware
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token is required", success: false });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_INVITE_KEY);
        const { email, familyId, role } = decoded;
        // 1. Check if the user email matches the token email
        const user = await User.findById(userId);
        if (!user || user.email !== email) {
            return res.status(403).json({ message: "Token email does not match user email", success: false });
        }
        // 2. Add user to the family members if not already a member
        const family = await Family.findById(familyId);
        if (!family) {
            return res.status(404).json({ message: "Family not found", success: false });
        }
        if (family.members.includes(userId)) {
            return res.status(400).json({ message: "User is already a member of this family", success: false });
        }   
        family.members.push(userId);
        await family.save();
        // Optionally, you can also set the user's role in the family if you have such a field
        // user.role = role; // Uncomment if you have a role field in User model
        // await user.save();
        return res.status(200).json({
            message: `Successfully joined the family ${family.familyName}`,
            success: true,
            family
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}



