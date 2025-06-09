import express from "express";
import {
  createJournal,
  markAttendance,
  addSummative,
  setBSQAndCalculateFinal,
  getJournalById
} from "../controller/journalController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isTeacher } from "../middleware/isTeacher.js";
import { getStudentJournals } from "../controller/journalController.js";
import { isStudent } from "../middleware/isStudent.js";

import { isAdminOrTeacher } from "../middleware/isAdminOrTeacher.js";

const router = express.Router();
router.post("/create", authMiddleware, isTeacher, createJournal);
router.patch("/attendance", authMiddleware, isTeacher, markAttendance);
router.patch("/summative", authMiddleware, isTeacher, addSummative);
router.post("/bsq", authMiddleware, isTeacher, setBSQAndCalculateFinal);
router.get("/:id", authMiddleware, isAdminOrTeacher, getJournalById);
router.get("/my", authMiddleware, isStudent, getStudentJournals);

export default router;
