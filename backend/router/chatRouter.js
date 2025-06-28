import express from "express";
import {
  sendMessageToLesson,
  getLessonMessages,
  editMessageFromLesson,
  deleteMessageFromLesson,
  sendMessageToTeacherChat,
  getTeacherChatMessages,
  getCombinedTeacherMessages,
  getMergedMessages,
  sendMergedMessage,
  editMergedMessage,
  deleteMergedMessage
} from "../controller/chatMessageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/lesson/send", authMiddleware, sendMessageToLesson);


router.get("/lesson/:lessonId", authMiddleware, getLessonMessages);


router.put("/lesson/message/:messageId", authMiddleware, editMessageFromLesson);


router.delete("/lesson/message/:messageId", authMiddleware, deleteMessageFromLesson);


router.post("/send/teacher", authMiddleware, sendMessageToTeacherChat);
router.get("/messages/teacher", authMiddleware, getTeacherChatMessages);
router.get("/messages/combined", authMiddleware, getCombinedTeacherMessages);
router.get("/merged", authMiddleware, getMergedMessages);
router.post("/merged/send", authMiddleware, sendMergedMessage);
router.put("/merged/message/:id", authMiddleware, editMergedMessage);
router.delete("/merged/message/:id", authMiddleware, deleteMergedMessage);
export default router;
