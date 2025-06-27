import mongoose from "mongoose";

  const chatMessageSchema = new mongoose.Schema({
  lesson: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ChatMessage", chatMessageSchema);
