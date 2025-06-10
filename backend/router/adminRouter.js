import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { setUserRole, getAllUsers, createUserByAdmin, setMultipleUserRoles } from "../controller/adminController.js";
import { getTeachersWithSubjects } from "../controller/adminController.js";
import { getStudentsForClassAssignment } from "../controller/adminController.js";

import { getAllPendingStudentsWithClass } from "../controller/adminController.js";

const router = express.Router();


router.put("/set-role/:id", authMiddleware, isAdmin, setUserRole);
router.get("/all-users", authMiddleware, isAdmin, getAllUsers);
router.post("/create-user", authMiddleware, isAdmin, createUserByAdmin);
router.put("/set-multiple-roles", authMiddleware, isAdmin, setMultipleUserRoles);
router.get("/teachers-with-subjects", getTeachersWithSubjects);
router.get("/pending-students-with-class", getAllPendingStudentsWithClass);
router.get("/students-for-class", authMiddleware, isAdmin, getStudentsForClassAssignment);
export default router;