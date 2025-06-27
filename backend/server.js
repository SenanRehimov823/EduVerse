import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDb } from "./config/config.js";

// Routers
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

// Models
import ChatMessage from "./model/chatMessage.js"; // Socket üçün lazım

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// ✅ Middleware-lər
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ MongoDB bağlantısı
connectDb();

// ✅ API yolları
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

// ✅ Statik fayllar
app.use("/uploads", express.static("uploads"));

// ✅ Socket.IO event-lər
io.on("connection", (socket) => {
  console.log("🔌 Yeni client qoşuldu:", socket.id);

  // Müəyyən dərs otağına qoşulma
  socket.on("joinLessonRoom", (lessonId) => {
    socket.join(lessonId);
    console.log(`📥 ${socket.id} qoşuldu dərs otağına: ${lessonId}`);
  });

  // Yeni mesaj gəldikdə yayım
  socket.on("sendLessonMessage", async ({ lessonId, message }) => {
    try {
      const populatedMessage = await ChatMessage.findById(message._id)
        .populate("sender", "name")
        .lean();

      if (populatedMessage) {
        io.to(lessonId).emit("newLessonMessage", populatedMessage);
        console.log("✅ Yeni mesaj yayıldı:", populatedMessage.message);
      } else {
        console.warn("⚠️ Mesaj tapılmadı:", message._id);
      }
    } catch (error) {
      console.error("❌ Mesaj yayımı xətası:", error.message);
    }
  });

  // Client ayrıldıqda
  socket.on("disconnect", () => {
    console.log("❌ Client ayrıldı:", socket.id);
  });
});

// ✅ Serveri işə sal
server.listen(5000, () => {
  console.log("🚀 Server və Socket.IO işləyir ");
});
