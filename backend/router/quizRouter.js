import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createQuiz,
  getQuizzesByTeacher,
  deleteQuiz,
  getAvailableQuizzesForStudent
} from "../controller/quizController.js";

const router = express.Router();

router.post("/create", authMiddleware, createQuiz); 
router.get("/my-quizzes", authMiddleware, getQuizzesByTeacher); 
router.delete("/:id", authMiddleware, deleteQuiz); 
router.get("/available", authMiddleware, getAvailableQuizzesForStudent); 

export default router;
