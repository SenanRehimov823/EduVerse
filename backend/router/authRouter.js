import express from "express";
import { changePassword, deleteAccount, getMe, login, logout, register, } from "../controller/authController.js";
import { authMiddleware, } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout)
// router.post("/verify-otp", verifyOtp);
router.patch("/change-password", authMiddleware, changePassword);
router.get("/me", authMiddleware, getMe);
router.delete("/delete-account", authMiddleware, deleteAccount);


export default router;
