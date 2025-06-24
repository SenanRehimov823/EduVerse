import mongoose from "mongoose";
const journalSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subject: { type: String, required: true },
  topic: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  
  homework: {
    text: { type: String, default: "" },
    file: { type: String, default: "" },
  },

  records: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      attendance: {
        type: String,
        enum: ["etdi", "etmədi"]
      },
      term1: {
        summatives: [{ score: Number, grade: Number, date: Date }],
        bsq: { score: Number, grade: Number },
        average: Number,
        grade: Number
      },
      term2: {
        summatives: [{ score: Number, grade: Number, date: Date }],
        bsq: { score: Number, grade: Number },
        average: Number,
        grade: Number
      },
      final: {
        score: Number,
        grade: Number
      },
    
      homework: {
        file: { type: String, default: "" },
        grade: { type: Number, default: null }
      }
    }
  ]
});
export default mongoose.model("Journal", journalSchema);