import express from "express";
import {
  createClass,
  assignTeacherToClass,
  assignStudentToClass,
  getAllClasses,
  deleteClass,
  removeTeacherFromClass,
  assignMultipleStudentsToClass,
  addSubjectTeacher
} from "../controller/classController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createClass);
router.post("/assign-teacher", authMiddleware, isAdmin, assignTeacherToClass);
router.post("/assign-student",assignStudentToClass,authMiddleware,isAdmin);
router.post("/assign-multiple-students", authMiddleware, isAdmin, assignMultipleStudentsToClass);
router.get("/all-classes", authMiddleware, isAdmin, getAllClasses);
router.delete("/remove-teacher/:className", authMiddleware, isAdmin, removeTeacherFromClass);
router.post("/add-subject-teacher", addSubjectTeacher);
router.delete("/:grade", authMiddleware, isAdmin, deleteClass);
router.delete("/:grade/:section", authMiddleware, isAdmin, deleteClass);
router.delete("/:grade/:section/:sector", authMiddleware, isAdmin, deleteClass);
export default router;