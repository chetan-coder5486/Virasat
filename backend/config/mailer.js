import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure the transporter using your email service credentials
// We are using environment variables for security
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env file
        pass: process.env.EMAIL_PASS  // Your Gmail App Password from .env file
    }
});


export default transporter;
