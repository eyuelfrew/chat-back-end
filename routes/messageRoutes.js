import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  sendMessage,
  allMessages,
  ClearMessages,
} from "../controllers/messageController.js";
const router = express.Router();
router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.route("/clear/:chatId").delete(protect, ClearMessages);
export default router;
