import mongoose from "mongoose";

const classGroupChatSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  headTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("ClassGroupChat", classGroupChatSchema);