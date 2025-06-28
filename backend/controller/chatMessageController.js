import ChatMessage from "../model/chatMessage.js";
import Lesson from "../model/lesson.js";
import User from "../model/user.js";
import TeacherChatMessage from "../model/TeacherChatMessage.js";
 import Subject from "../model/subject.js";
 import Class from "../model/class.js";
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

// Müəllimin mesaj göndərməsi
export const sendMessageToTeacherChat = async (req, res) => {
  try {
    const { subject, className, message } = req.body;
    const senderId = req.user.id;

    console.log("📨 Müəllim mesaj göndərir:", { subject, className, message, senderId });

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Boş mesaj göndərmək olmaz!" });
    }

    const chatMessage = await TeacherChatMessage.create({
      subject,
      className,
      sender: senderId,
      message,
    });

    await chatMessage.populate("sender", "name role");

    console.log("✅ Mesaj DB-yə yazıldı:", chatMessage);

    res.status(201).json({ message: "Mesaj göndərildi", chatMessage });
  } catch (error) {
    console.error("❌ sendMessageToTeacherChat error:", error);
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};

// Müəllimin mesajlarını gətir
export const getTeacherChatMessages = async (req, res) => {
  try {
    const { subject, className } = req.query;

    console.log("📥 [GET /messages/teacher] subject:", subject);
    console.log("📥 [GET /messages/teacher] className:", className);

    if (!subject || !className) {
      return res.status(400).json({ message: "Subject və className tələb olunur" });
    }

    const messages = await TeacherChatMessage.find({ subject, className })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    console.log("📤 Tapılan müəllim mesajları:", messages.length);

    res.status(200).json({ messages });
  } catch (error) {
    console.error("❌ getTeacherChatMessages error:", error);
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};

// Birləşmiş mesajları gətir
export const getCombinedTeacherMessages = async (req, res) => {
  try {
    const { subject, className } = req.query;

    console.log("📥 [GET /messages/combined] subject:", subject);
    console.log("📥 [GET /messages/combined] className:", className);

    // Sadə yoxlama: 1 və ya 2 simvollu sinif (8, 9, 10), istəyə görə sonu hərflə də ola bilər (8A, 9B)
    const isValidClassName = /^[0-9]{1,2}[A-Z]?$/.test(className?.toString().toUpperCase());

    if (!isValidClassName) {
      console.log("❌ className düzgün formatda deyil:", className);
      return res.status(400).json({ message: "className formatı yanlışdır (məsələn: '8' və ya '8A')" });
    }

    const teacherId = req.user.id;

    const [sentMessages, receivedMessages] = await Promise.all([
      ChatMessage.find({ sender: teacherId, subject, className }),
      ChatMessage.find({ receiver: teacherId, subject, className }),
    ]);

    const combined = [...sentMessages, ...receivedMessages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    res.status(200).json(combined);
  } catch (err) {
    console.error("getCombinedTeacherMessages error:", err);
    res.status(500).json({ message: "Mesajları almaqda xəta baş verdi" });
  }
};
// Merged chat mesajlarını almaq
export const getMergedMessages = async (req, res) => {
  try {
    const { subject, className } = req.query;
    if (!subject || !className) return res.status(400).json({ message: "Məlumat natamamdır" });

    const messages = await TeacherChatMessage.find({ subject, className })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Server xətası" });
  }
};

// Merged chat üçün mesaj göndərmək
export const sendMergedMessage = async (req, res) => {
  try {
    console.log("📥 Yeni merged mesaj sorğusu gəldi");
    console.log("🧾 Body:", req.body);
    console.log("👤 İstifadəçi:", req.user);

    const { subject, className, message } = req.body;
    const sender = req.user.id;

    if (!subject || !className || !message) {
      console.warn("⚠️ Boş sahə:", { subject, className, message });
      return res.status(400).json({ message: "Məlumat natamamdır" });
    }

    const newMsg = await TeacherChatMessage.create({ subject, className, message, sender });
    const populated = await newMsg.populate("sender", "name role");

    console.log("✅ Yeni merged mesaj yaradıldı:", populated);

    res.status(201).json({ message: populated });
  } catch (err) {
    console.error("❌ sendMergedMessage error:", err);
    res.status(500).json({ message: "Server xətası" });
  }
};
export const editMergedMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Mesaj boş ola bilməz" });
    }

    const existing = await TeacherChatMessage.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Mesaj tapılmadı" });
    }

    existing.message = message + "";
    existing.edited = true; 
    await existing.save();

    const populated = await existing.populate("sender", "name role");

    req.io.to(`${existing.subject}_${existing.className}`).emit("editedMergedMessage", populated);
    res.status(200).json({ message: populated });
  } catch (err) {
    console.error("🛠️ Mesaj redaktə xətası:", err);
    res.status(500).json({ message: "Redaktə xətası baş verdi" });
  }
};


export const deleteMergedMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await TeacherChatMessage.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Mesaj tapılmadı" });
    }

    await TeacherChatMessage.findByIdAndDelete(id);

    req.io.to(`${existing.subject}_${existing.className}`).emit("deletedMergedMessage", { id });
    res.status(200).json({ message: "Mesaj silindi", id });
  } catch (err) {
    console.error("🗑️ Mesaj silinmə xətası:", err);
    res.status(500).json({ message: "Silinmə xətası baş verdi" });
  }
};
