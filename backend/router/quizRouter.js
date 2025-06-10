import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isTeacher } from "../middleware/isTeacher.js";
import { createQuiz, getQuizzesByTeacher, deleteQuiz } from "../controller/quizController.js";

const router = express.Router();

router.post("/create", authMiddleware, isTeacher, createQuiz);
router.get("/my-quizzes", authMiddleware, isTeacher, getQuizzesByTeacher);
router.delete("/delete/:id", authMiddleware, isTeacher, deleteQuiz);

export default router;
