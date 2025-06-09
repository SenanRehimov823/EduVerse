import express from "express";
import {
  markAttendance,
  addSummative,
  setBSQAndCalculateFinal,
  getJournalBySubject,
  getStudentJournals,
  updateJournalTopic,
  getJournalByDate
} from "../controller/journalController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isTeacher } from "../middleware/isTeacher.js";
import { isStudent } from "../middleware/isStudent.js";
import { isAdminOrTeacher } from "../middleware/isAdminOrTeacher.js";

const router = express.Router();
router.patch("/attendance", authMiddleware, isTeacher, markAttendance);
router.patch("/summative", authMiddleware, isTeacher, addSummative);
router.post("/bsq", authMiddleware, isTeacher, setBSQAndCalculateFinal);
router.get("/class/:className/:subject", authMiddleware, isTeacher, getJournalBySubject);
router.get("/my", authMiddleware, isStudent, getStudentJournals);
router.patch("/topic", authMiddleware, isTeacher, updateJournalTopic);
router.get("/by-date", authMiddleware, isAdminOrTeacher, getJournalByDate);

export default router;
