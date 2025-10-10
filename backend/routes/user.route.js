import express from "express";
import { login, logout, register, verifyInvite, updateUserProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify-invite").post(verifyInvite);

// Add this route for profile update
// 'profilePhoto' should match the input name in FormData
router.route("/:id").put(upload.single("profilePhoto"), updateUserProfile);

export default router;
