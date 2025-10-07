import express from "express"
import { acceptInvite, createFamily, getFamilyDetails, getMemories, getTagSuggestions, sendInvite} from "../controllers/family.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from '../middlewares/multer.js';
import { createMemory } from "../controllers/memory.controller.js";

const router = express.Router();
router.route("/create").post(isAuthenticated,createFamily)
router.route("/send-invite").post(isAuthenticated,sendInvite)
router.route("/get-details").get(isAuthenticated, getFamilyDetails)
router.route("/accept-invite").post(isAuthenticated,acceptInvite)
router.route("/memories").get(isAuthenticated, getMemories);
router.route("/tags/autocomplete").get(isAuthenticated, getTagSuggestions);
<<<<<<< HEAD
// 'memoryFile' is the field name the frontend will use for the file
router.route("/memories/create").post(isAuthenticated, upload.single('memoryFile'), createMemory);
=======
>>>>>>> 39dbe1ea1c50897f39e9aa49b0373cb084aaad8f


export default router