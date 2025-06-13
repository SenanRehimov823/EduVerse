import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  submitQuiz,
  getResultsByQuizIdForTeacher,
  getQuizStats,
  getQuizDetailsForStudent,
  getActiveQuizzesForStudent
} from "../controller/quizResultController.js";

const router = express.Router();

router.post("/submit", authMiddleware, submitQuiz);
router.get("/by-quiz/:quizId", authMiddleware, getResultsByQuizIdForTeacher);
router.get("/stats/:quizId", authMiddleware, getQuizStats);
router.get("/student-view/:quizId", authMiddleware, getQuizDetailsForStudent);
router.get("/active-for-student", authMiddleware, getActiveQuizzesForStudent);
export default router;
