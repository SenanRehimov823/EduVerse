import express from "express";
import {
  markAttendance,
  addSummative,
  setBSQAndCalculateFinal,
  getJournalBySubject,
  getStudentJournals,
  updateJournalTopic,
  getJournalByDate,
  addHomeworkByTeacher,
  submitHomeworkByStudent,
  updateJournal
} from "../controller/journalController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isTeacher } from "../middleware/isTeacher.js";
import { isStudent } from "../middleware/isStudent.js";
import { isAdminOrTeacher } from "../middleware/isAdminOrTeacher.js";
import { gradeHomework } from "../controller/journalController.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.patch("/attendance", authMiddleware, isTeacher, markAttendance);
router.patch("/summative", authMiddleware, isTeacher, addSummative);
router.post("/bsq", authMiddleware, isTeacher, setBSQAndCalculateFinal);
router.get("/class/:className/:subject", authMiddleware, isTeacher, getJournalBySubject);
router.get("/my", authMiddleware, isStudent, getStudentJournals);
router.patch("/topic", authMiddleware, isTeacher, updateJournalTopic);
router.get("/by-date", authMiddleware, isAdminOrTeacher, getJournalByDate);
router.put("/update/:journalId", authMiddleware, isTeacher, updateJournal);
router.patch("/homework", authMiddleware, isTeacher, addHomeworkByTeacher);
router.patch("/homework-submit", authMiddleware, isStudent, upload.single("file"), submitHomeworkByStudent);

router.post("/homework/grade", authMiddleware, isTeacher, gradeHomework);
export default router;
