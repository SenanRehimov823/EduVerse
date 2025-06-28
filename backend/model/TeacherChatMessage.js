import mongoose from "mongoose";
const teacherChatSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  className: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  edited: {
  type: Boolean,
  default: false
},createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("TeacherChatMessage", teacherChatSchema);
