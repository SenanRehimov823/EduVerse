import express from "express";
import { sendMessageToGroup, getGroupMessages, editMessage, deleteMessage } from "../controller/chatMessageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessageToGroup);
router.get("/group/:groupId", authMiddleware, getGroupMessages);
router.delete("/message/:messageId", authMiddleware, deleteMessage);


router.put("/message/:messageId", authMiddleware, editMessage);

export default router;