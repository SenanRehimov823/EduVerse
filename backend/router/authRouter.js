import express from "express";
import { changePassword, deleteAccount, getMe, getTeachersBySubject, login, logout, register, } from "../controller/authController.js";
import { authMiddleware, } from "../middleware/authMiddleware.js";
import { registerTeacher, registerStudent } from "../controller/authController.js";
import { loginLimiter } from "../middleware/rateLimit.js";
const router = express.Router();
router.post("/register", register);
router.post("/login",loginLimiter, login);
router.post("/logout", logout)
// router.post("/verify-otp", verifyOtp);
router.patch("/change-password", authMiddleware, changePassword);
router.get("/me", authMiddleware, getMe);
router.delete("/delete-account", authMiddleware, deleteAccount);

router.post("/register/student", registerStudent);
router.post("/register/teacher", registerTeacher);
router.get("/teachers-by-subject/:subjectId", getTeachersBySubject);
export default router;
