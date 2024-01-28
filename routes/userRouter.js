import express from "express";
import { registerUser } from "../controllers/userControllers.js";
import {
  authUser,
  allUsers,
  verifiyEmail,
} from "../controllers/userControllers.js";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";
const upload = multer({ dest: "files/" });
const router = express.Router();
router.route("/").post(upload.any(), registerUser).get(protect, allUsers);
router.post("/login", upload.any(), authUser);
router.post("/verifiyemail", verifiyEmail);
export default router;
