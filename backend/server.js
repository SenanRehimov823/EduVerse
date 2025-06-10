import express from "express";
import cors from "cors";
import authRouter from "./router/authRouter.js";
import { connectDb } from "./config/config.js";
import cookieParser from "cookie-parser";
import adminRouter from "./router/adminRouter.js";
import classRouter from "./router/classRouter.js";
import journalRouter from "./router/journalRouter.js"
import lessonRouter from "./router/lessonRouter.js"
import subjectRouter from "./router/subjectRouter.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true               
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

connectDb();


app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/class", classRouter);
app.use("/api/journal",journalRouter);
app.use("/api/lesson",lessonRouter);
app.use("/api/subject", subjectRouter);
app.listen(5000, () => console.log("Server işləyir"));
