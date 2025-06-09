import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isTeacher } from "../middleware/isTeacher.js";
import {
  createLessonWithJournal,
  getLessonsByTeacher,
  getJournalsByClassForTeacher,
  getAllLessonsInClassForSupervisor
} from "../controller/lessonController.js";

const router = express.Router();


router.post("/create", authMiddleware, isTeacher, createLessonWithJournal);
router.get("/my", authMiddleware, isTeacher, getLessonsByTeacher);
router.get("/class/:className", authMiddleware, isTeacher, getJournalsByClassForTeacher);
router.get("/supervisor/:className", authMiddleware, isTeacher, getAllLessonsInClassForSupervisor);

export default router;
