import express from "express";
import {
  createLessonWithJournal,
  getLessonsByTeacher,
  getLessonsByClass,
  getAllLessonsForAdmin
} from "../controller/lessonController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createLessonWithJournal);
router.get("/by-teacher", authMiddleware, getLessonsByTeacher);
router.get("/by-class/:className", authMiddleware, getLessonsByClass);
router.get("/admin/all", authMiddleware, getAllLessonsForAdmin);

export default router;
