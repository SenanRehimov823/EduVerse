import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      question: String,
      selectedOptions: [Number], 
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startTime: {
    type: Date,
    required: true,
  },
  autoSubmitted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("QuizResult", quizResultSchema);
