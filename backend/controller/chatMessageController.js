import ChatMessage from "../model/chatMessage.js";
import Lesson from "../model/lesson.js";
import User from "../model/user.js";
import TeacherChatMessage from "../model/TeacherChatMessage.js";
import Subject from "../model/subject.js";
import Class from "../model/class.js";

export const sendMessageToLesson = async (req, res) => {
  try {
    const { lessonId, message } = req.body;
    const senderId = req.user.id;

    if (!message || !message.trim()) return res.status(400).json();

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json();

    const isTeacher = lesson.teacher.toString() === senderId.toString();
    const isStudent = await User.exists({ _id: senderId, class: lesson.class, role: "student" });

    if (!(isTeacher || isStudent)) return res.status(403).json();

    const chatMessage = await ChatMessage.create({ lesson: lessonId, sender: senderId, message });
    res.status(201).json({ chatMessage });
  } catch {
    res.status(500).json();
  }
};

export const getLessonMessages = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const messages = await ChatMessage.find({ lesson: lessonId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch {
    res.status(500).json();
  }
};

export const editMessageFromLesson = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) return res.status(400).json();

    const chatMessage = await ChatMessage.findById(messageId);
    if (!chatMessage) return res.status(404).json();

    const lesson = await Lesson.findById(chatMessage.lesson);
    if (!lesson) return res.status(404).json();

    const isOwner = chatMessage.sender.toString() === userId.toString();
    const isTeacher = lesson.teacher.toString() === userId.toString();

    if (!(isOwner || isTeacher)) return res.status(403).json();

    chatMessage.message = message;
    chatMessage.updatedAt = new Date();
    await chatMessage.save();
    await chatMessage.populate("sender", "name role");

    res.status(200).json({ chatMessage });
  } catch {
    res.status(500).json();
  }
};

export const deleteMessageFromLesson = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const chatMessage = await ChatMessage.findById(messageId);
    if (!chatMessage) return res.status(404).json();

    const lesson = await Lesson.findById(chatMessage.lesson);
    if (!lesson) return res.status(404).json();

    const isOwner = chatMessage.sender.toString() === userId.toString();
    const isTeacher = lesson.teacher.toString() === userId.toString();

    if (!(isOwner || isTeacher)) return res.status(403).json();

    await chatMessage.deleteOne();
    res.status(200).json();
  } catch {
    res.status(500).json();
  }
};

export const sendMessageToTeacherChat = async (req, res) => {
  try {
    const { subject, className, message } = req.body;
    const senderId = req.user.id;

    if (!message || !message.trim()) return res.status(400).json();

    const chatMessage = await TeacherChatMessage.create({ subject, className, sender: senderId, message });
    await chatMessage.populate("sender", "name role");
    res.status(201).json({ chatMessage });
  } catch {
    res.status(500).json();
  }
};

export const getTeacherChatMessages = async (req, res) => {
  try {
    const { subject, className } = req.query;
    if (!subject || !className) return res.status(400).json();

    const messages = await TeacherChatMessage.find({ subject, className })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch {
    res.status(500).json();
  }
};

export const getCombinedTeacherMessages = async (req, res) => {
  try {
    const { subject, className } = req.query;
    const isValidClassName = /^[0-9]{1,2}[A-Z]?$/.test(className?.toString().toUpperCase());
    if (!isValidClassName) return res.status(400).json();

    const teacherId = req.user.id;
    const [sentMessages, receivedMessages] = await Promise.all([
      ChatMessage.find({ sender: teacherId, subject, className }),
      ChatMessage.find({ receiver: teacherId, subject, className })
    ]);

    const combined = [...sentMessages, ...receivedMessages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    res.status(200).json(combined);
  } catch {
    res.status(500).json();
  }
};

export const getMergedMessages = async (req, res) => {
  try {
    const { subject, className } = req.query;
    if (!subject || !className) return res.status(400).json();

    const messages = await TeacherChatMessage.find({ subject, className })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch {
    res.status(500).json();
  }
};

export const sendMergedMessage = async (req, res) => {
  try {
    const { subject, className, message } = req.body;
    const sender = req.user.id;

    if (!subject || !className || !message) return res.status(400).json();

    const newMsg = await TeacherChatMessage.create({ subject, className, message, sender });
    const populated = await newMsg.populate("sender", "name role");

    res.status(201).json({ message: populated });
  } catch {
    res.status(500).json();
  }
};

export const editMergedMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message?.trim()) return res.status(400).json();

    const existing = await TeacherChatMessage.findById(id);
    if (!existing) return res.status(404).json();

    existing.message = message + "";
    existing.edited = true;
    await existing.save();
    const populated = await existing.populate("sender", "name role");

    req.io.to(`${existing.subject}_${existing.className}`).emit("editedMergedMessage", populated);
    res.status(200).json({ message: populated });
  } catch {
    res.status(500).json();
  }
};

export const deleteMergedMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TeacherChatMessage.findById(id);
    if (!existing) return res.status(404).json();

    await TeacherChatMessage.findByIdAndDelete(id);
    req.io.to(`${existing.subject}_${existing.className}`).emit("deletedMergedMessage", { id });
    res.status(200).json({ id });
  } catch {
    res.status(500).json();
  }
};