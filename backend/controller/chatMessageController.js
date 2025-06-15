import ChatMessage from "../model/chatMessage.js";
import ClassGroupChat from "../model/classGroupChat.js";
import User from "../model/user.js";


export const sendMessageToGroup = async (req, res) => {
  try {
    const { groupId, message } = req.body;
    const senderId = req.user.id || req.user._id; 

  
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Boş mesaj göndərmək olmaz!" });
    }

    
    const group = await ClassGroupChat.findById(groupId);
    if (!group) return res.status(404).json({ message: "Qrup tapılmadı!" });

    
    const isStudent = group.students.map(s => s.toString()).includes(senderId.toString());
    const isTeacher = group.teacher.toString() === senderId.toString();
    const isHead = group.headTeacher.toString() === senderId.toString();
    if (!(isStudent || isTeacher || isHead)) {
      return res.status(403).json({ message: "Bu qrupda icazəniz yoxdur!" });
    }

    
    const chatMessage = await ChatMessage.create({
      group: groupId,
      sender: senderId,
      message,
    });

    res.status(201).json({ message: "Mesaj göndərildi", chatMessage });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await ChatMessage.find({ group: groupId })
      .populate('sender', 'name role') 
      .sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id || req.user._id;

    const chatMessage = await ChatMessage.findById(messageId);
    if (!chatMessage) {
      return res.status(404).json({ message: "Mesaj tapılmadı!" });
    }

    const group = await ClassGroupChat.findById(chatMessage.group);
    if (!group) {
      return res.status(404).json({ message: "Qrup tapılmadı!" });
    }

   
    const isOwner = chatMessage.sender.toString() === userId.toString();
    const isTeacher = group.teacher.toString() === userId.toString();
    const isHead = group.headTeacher.toString() === userId.toString();

    if (!(isOwner || isTeacher || isHead)) {
      return res.status(403).json({ message: "Bu mesajı silmək icazəniz yoxdur!" });
    }

    await chatMessage.deleteOne();

    res.status(200).json({ message: "Mesaj silindi." });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};


export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;
    const userId = req.user.id || req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Boş mesaj göndərmək olmaz!" });
    }

    const chatMessage = await ChatMessage.findById(messageId);
    if (!chatMessage) {
      return res.status(404).json({ message: "Mesaj tapılmadı!" });
    }

    const group = await ClassGroupChat.findById(chatMessage.group);
    if (!group) {
      return res.status(404).json({ message: "Qrup tapılmadı!" });
    }

  
    const isOwner = chatMessage.sender.toString() === userId.toString();
    const isTeacher = group.teacher.toString() === userId.toString();
    const isHead = group.headTeacher.toString() === userId.toString();

    if (!(isOwner || isTeacher || isHead)) {
      return res.status(403).json({ message: "Bu mesajı redaktə etmək icazəniz yoxdur!" });
    }

    chatMessage.message = message;
    chatMessage.updatedAt = new Date();
    await chatMessage.save();

    res.status(200).json({ message: "Mesaj redaktə olundu.", chatMessage });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};