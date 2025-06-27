import ChatMessage from "../model/chatMessage.js";
import Lesson from "../model/lesson.js";
import User from "../model/user.js";

// Mesaj göndər (Lesson əsaslı)
export const sendMessageToLesson = async (req, res) => {
  try {
    const { lessonId, message } = req.body;
    const senderId = req.user.id;

    // 🪵 Debug loglar
    console.log("📥 Gələn lessonId:", lessonId);
    console.log("✉️ Gələn mesaj:", message);
    console.log("👤 Göndərən user:", senderId);

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Boş mesaj göndərmək olmaz!" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Dərs tapılmadı!" });

    const isTeacher = lesson.teacher.toString() === senderId.toString();
    const isStudent = await User.exists({ _id: senderId, class: lesson.class, role: "student" });

    if (!(isTeacher || isStudent)) {
      return res.status(403).json({ message: "Bu dərsə giriş icazəniz yoxdur!" });
    }

    const chatMessage = await ChatMessage.create({
      lesson: lessonId,
      sender: senderId,
      message,
    });

    res.status(201).json({ message: "Mesaj göndərildi", chatMessage });
  } catch (error) {
    console.error("❌ sendMessageToLesson error:", error);
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};

// Mesajları gətir (Lesson əsaslı)
export const getLessonMessages = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const messages = await ChatMessage.find({ lesson: lessonId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
export const editMessageFromLesson = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Boş mesaj göndərmək olmaz!" });
    }

    const chatMessage = await ChatMessage.findById(messageId);
    if (!chatMessage) {
      return res.status(404).json({ message: "Mesaj tapılmadı!" });
    }

    const lesson = await Lesson.findById(chatMessage.lesson);
    if (!lesson) {
      return res.status(404).json({ message: "Dərs tapılmadı!" });
    }

    const isOwner = chatMessage.sender.toString() === userId.toString();
    const isTeacher = lesson.teacher.toString() === userId.toString();

    if (!(isOwner || isTeacher)) {
      return res.status(403).json({ message: "Bu mesajı redaktə etmək icazəniz yoxdur!" });
    }

    chatMessage.message = message;
    chatMessage.updatedAt = new Date();
    await chatMessage.save();

    // 💬 Redaktədən sonra göndərən şəxsin məlumatını əlavə et
    await chatMessage.populate("sender", "name role");

    res.status(200).json({ message: "Mesaj redaktə olundu.", chatMessage });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};

export const deleteMessageFromLesson = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const chatMessage = await ChatMessage.findById(messageId);
    if (!chatMessage) {
      return res.status(404).json({ message: "Mesaj tapılmadı!" });
    }

    const lesson = await Lesson.findById(chatMessage.lesson);
    if (!lesson) {
      return res.status(404).json({ message: "Dərs tapılmadı!" });
    }

    const isOwner = chatMessage.sender.toString() === userId.toString();
    const isTeacher = lesson.teacher.toString() === userId.toString();

    if (!(isOwner || isTeacher)) {
      return res.status(403).json({ message: "Bu mesajı silmək icazəniz yoxdur!" });
    }

    await chatMessage.deleteOne();
    res.status(200).json({ message: "Mesaj silindi." });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
