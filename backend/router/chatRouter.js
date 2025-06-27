import express from "express";
import {
  sendMessageToLesson,
  getLessonMessages,
  editMessageFromLesson,
  deleteMessageFromLesson
} from "../controller/chatMessageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/lesson/send", authMiddleware, sendMessageToLesson);


router.get("/lesson/:lessonId", authMiddleware, getLessonMessages);


router.put("/lesson/message/:messageId", authMiddleware, editMessageFromLesson);


router.delete("/lesson/message/:messageId", authMiddleware, deleteMessageFromLesson);

export default router;
