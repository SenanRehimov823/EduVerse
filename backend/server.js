import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDb } from "./config/config.js";
import ChatMessage from "./model/chatMessage.js";
import TeacherChatMessage from "./model/TeacherChatMessage.js";
import paymentRoutes from "./router/payment.js";

import authRouter from "./router/authRouter.js";
import adminRouter from "./router/adminRouter.js";
import classRouter from "./router/classRouter.js";
import journalRouter from "./router/journalRouter.js";
import lessonRouter from "./router/lessonRouter.js";
import subjectRouter from "./router/subjectRouter.js";
import quizRouter from "./router/quizRouter.js";
import quizResultRouter from "./router/quizResultRouter.js";
import studentRouter from "./router/studentRouter.js";
import chatRouter from "./router/chatRouter.js";
import courseRoutes from "./router/course.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.io = io;
  next();
});

connectDb();

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/class", classRouter);
app.use("/api/journal", journalRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/quiz-result", quizResultRouter);
app.use("/api/student", studentRouter);
app.use("/chat", chatRouter);
app.use("/api/course", courseRoutes);
app.use("/api/payment", paymentRoutes);

io.on("connection", (socket) => {
  socket.on("joinLessonRoom", (lessonId) => {
    socket.join(lessonId);
  });

  socket.on("joinTeacherRoom", (roomKey) => {
    socket.join(roomKey);
  });

  socket.on("joinMergedRoom", (roomKey) => {
    socket.join(roomKey);
  });

  socket.on("sendLessonMessage", async ({ lessonId, message }) => {
    try {
      const populatedMessage = await ChatMessage.findById(message._id)
        .populate("sender", "name")
        .lean();
      if (populatedMessage) {
        io.to(lessonId).emit("newLessonMessage", populatedMessage);
      }
    } catch (error) {}
  });

  socket.on("sendTeacherMessage", async ({ roomKey, message }) => {
    try {
      const populatedMessage = await TeacherChatMessage.findById(message._id)
        .populate("sender", "name role")
        .lean();
      if (populatedMessage) {
        io.to(roomKey).emit("newTeacherMessage", populatedMessage);
      }
    } catch (error) {}
  });

  socket.on("sendMergedMessage", async ({ roomKey, message }) => {
    try {
      const populatedMessage = await TeacherChatMessage.findById(message._id)
        .populate("sender", "name role")
        .lean();
      if (populatedMessage) {
        io.to(roomKey).emit("newMergedMessage", populatedMessage);
      }
    } catch (err) {}
  });

  socket.on("editMergedMessage", (updatedMessage) => {
    io.to(updatedMessage.roomKey).emit("editedMergedMessage", updatedMessage);
  });

  socket.on("deleteMergedMessage", ({ roomKey, messageId }) => {
    io.to(roomKey).emit("deletedMergedMessage", { messageId });
  });

  socket.on("disconnect", () => {});
});

server.listen(5000, () => {
  console.log(" Server  işləyir ");
});
