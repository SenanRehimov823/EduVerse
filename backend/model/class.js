import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  grade: {
    type: Number,
    required: true,
  },
  sector: {
    type: String,
    required: false, 
  },
  section: {
    type: String,
    required: false, 
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
}, { timestamps: true });

const Class = mongoose.model("Class", classSchema);
export default Class;
