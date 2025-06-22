import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  subject: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Subject",
  default: null
},
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "teacher", "parent", "admin", "pending"],
      default: "pending",
    },
    class: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Class",
  default: null
},
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
      grade: { type: String, default: "" }, 
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

