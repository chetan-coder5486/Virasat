import express from "express"
import { acceptInvite, createFamily, getFamilyDetails, getMemories, getMemoriesByUser, getTagSuggestions, sendInvite } from "../controllers/family.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from '../middlewares/multer.js';
import { createMemory, getTimelineEvents } from "../controllers/memory.controller.js";

const router = express.Router();
router.route("/create").post(isAuthenticated, createFamily)
router.route("/send-invite").post(isAuthenticated, sendInvite)
router.route("/get-details").get(isAuthenticated, getFamilyDetails)
router.route("/accept-invite").post(isAuthenticated, acceptInvite)
router.route("/memories").get(isAuthenticated, getMemories);
router.route("/memories/user/:id").get(isAuthenticated, getMemoriesByUser);
router.route("/timeline").get(isAuthenticated, getTimelineEvents);

router.route("/tags/autocomplete").get(isAuthenticated, getTagSuggestions);
// 'memoryFile' is the field name the frontend will use for the file
router.route("/memories/create").post(isAuthenticated, upload.array('memoryFiles',10), createMemory);


export default router