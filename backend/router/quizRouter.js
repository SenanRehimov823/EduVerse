import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createQuiz,
  getQuizzesByTeacher,
  deleteQuiz,
  getAvailableQuizzesForStudent,
  updateQuiz
} from "../controller/quizController.js";

const router = express.Router();

router.post("/create", authMiddleware, createQuiz); 
router.get("/my-quizzes", authMiddleware, getQuizzesByTeacher); 
router.delete("/:id", authMiddleware, deleteQuiz); 
router.get("/available", authMiddleware, getAvailableQuizzesForStudent); 
router.put("/:id", authMiddleware, updateQuiz);
export default router;
