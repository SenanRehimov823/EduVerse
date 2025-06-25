import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { submitHomeworkByStudent } from "../controller/journalController.js";
import {
  getMySubjects,
  getMyJournalBySubject,
  getMyQuizResultsBySubject,
  getMySubjectAverages,
  getStudentProfile,
  updateProfileImage,
  getActiveQuizzes,
  getQuizDetailsForStudent,
  getHomeworkBySubject
} from "../controller/studentController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/subjects", authMiddleware, getMySubjects);


router.get("/journal/:subject", authMiddleware, getMyJournalBySubject);

router.get("/quiz-results/:subject", authMiddleware, getMyQuizResultsBySubject);


router.get("/my-subject-averages", authMiddleware, getMySubjectAverages);


router.get("/profile", authMiddleware, getStudentProfile);


router.put("/profile-image", authMiddleware, upload.single("image"), updateProfileImage);


router.get("/quiz-active", authMiddleware, getActiveQuizzes);


router.get("/quiz-result/my/:quizId", authMiddleware, getQuizDetailsForStudent);


router.get("/homework/:subjectName", authMiddleware, getHomeworkBySubject);


router.post("/homework-submit", authMiddleware, upload.single("file"), submitHomeworkByStudent);
export default router;


