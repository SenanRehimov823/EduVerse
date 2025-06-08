import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { setUserRole, getPendingUsers, getAllUsers, createUserByAdmin, setMultipleUserRoles } from "../controller/adminController.js";

const router = express.Router();

router.get("/pending-users", authMiddleware, isAdmin, getPendingUsers);
router.put("/set-role/:id", authMiddleware, isAdmin, setUserRole);
router.get("/all-users", authMiddleware, isAdmin, getAllUsers);
router.post("/create-user", authMiddleware, isAdmin, createUserByAdmin);

router.put("/set-multiple-roles", authMiddleware, isAdmin, setMultipleUserRoles);
export default router;