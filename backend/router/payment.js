import express from "express";
import { createCheckoutSession } from "../controller/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-checkout-session",authMiddleware, createCheckoutSession);

export default router;
