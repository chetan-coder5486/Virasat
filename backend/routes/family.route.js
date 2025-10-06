import express from "express"
import { acceptInvite, createFamily, getFamilyDetails, sendInvite} from "../controllers/family.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/create").post(isAuthenticated,createFamily)
router.route("/send-invite").post(isAuthenticated,sendInvite)
router.route("/get-details").get(isAuthenticated, getFamilyDetails)
router.route("/accept-invite").post(isAuthenticated,acceptInvite)


export default router