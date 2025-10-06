import express from "express"
import { login, logout, register, verifyInvite } from "../controllers/user.controller.js";
const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/verify-invite").post(verifyInvite)

export default router