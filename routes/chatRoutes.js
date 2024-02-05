import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  DeletePersonalChat,
  removeFromGroup,
} from "../controllers/chatControllers.js";
const router = express.Router();
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);

router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupdadd").put(protect, addToGroup);
router.route("/del/:chatId").delete(protect, DeletePersonalChat);
export default router;
