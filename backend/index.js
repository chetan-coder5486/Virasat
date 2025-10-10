// 1. IMPORT ALL NECESSARY PACKAGES
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"; // <-- FIX #1: Import dotenv
import connectDb from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import familyRoute from "./routes/family.route.js";
import circleRoute from "./routes/circle.route.js"; // New route for circle management

// Load environment variables from .env file
dotenv.config();

const app = express();


// --- Middleware Setup ---
// To parse incoming JSON payloads
app.use(express.json());

// To parse incoming URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// To parse cookies from headers
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
    // <-- FIX #2: Added the missing colon in the URL
    origin: "http://localhost:5173",
    credentials: true, // Allows cookies to be sent from the frontend
};

app.use(cors(corsOptions));


// --- Routes ---
const PORT = process.env.PORT || 3000;

//apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/family", familyRoute); 
app.use("/api/v1/circle", circleRoute); // New route for circle management

app.listen(PORT, () => {
    connectDb()
    console.log(`✅ Server is running successfully on http://localhost:${PORT}`);
});