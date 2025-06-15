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

// Jurnal baxışı
router.get("/journal/:subject", authMiddleware, getMyJournalBySubject);

// Quiz nəticələri (bir fənn üzrə)
router.get("/quiz-results/:subject", authMiddleware, getMyQuizResultsBySubject);

// Quiz ortalamaları
router.get("/my-subject-averages", authMiddleware, getMySubjectAverages);

// Profil məlumatları
router.get("/profile", authMiddleware, getStudentProfile);

// Profil şəkli dəyişmək (Multer ilə)
router.put("/profile-image", authMiddleware, upload.single("image"), updateProfileImage);

// Aktiv quizlər
router.get("/quiz-active", authMiddleware, getActiveQuizzes);

// Öz verdiyi quizin detalları
router.get("/quiz-result/my/:quizId", authMiddleware, getQuizDetailsForStudent);

// Tapşırıqlara baxış
router.get("/homework/:subjectName", authMiddleware, getHomeworkBySubject);


router.post("/homework-submit", authMiddleware, upload.single("file"), submitHomeworkByStudent);
export default router;


