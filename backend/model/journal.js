import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
      summatives: [
        {
          score: Number,
          grade: Number,
        }
      ],
      bsq: {
        score: Number,
        grade: Number,
      },
      midtermAverage: Number,
      midtermGrade: Number,
      finalScore: Number,
      finalGrade: Number,
      homework: {
       text: { type: String, default: "" },
      file: { type: String, default: "" } 
      }
    }
  ]
});

export default mongoose.model("Journal", journalSchema);
