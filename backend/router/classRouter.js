import express from "express";
import {
    createClass,
    assignTeacherToClass,
    assignStudentToClass,
    getAllClasses,
    deleteClass,
    removeTeacherFromClass,
    assignMultipleStudentsToClass,
} from "../controller/classController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();


router.post("/create", authMiddleware, isAdmin, createClass);
router.post("/assign-teacher", authMiddleware, isAdmin, assignTeacherToClass);
router.post("/assign-student", authMiddleware, isAdmin, assignStudentToClass);
router.get("/", authMiddleware, isAdmin, getAllClasses);
router.delete("/remove-teacher/:classId", authMiddleware, isAdmin, removeTeacherFromClass);
router.delete("/:classId", authMiddleware, isAdmin, deleteClass);
router.post("/assign-multiple-students", authMiddleware, isAdmin, assignMultipleStudentsToClass);

export default router;
