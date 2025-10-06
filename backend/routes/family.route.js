import express from "express"
import { createFamily } from "../controllers/family.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/create").post(isAuthenticated,createFamily)

export default router