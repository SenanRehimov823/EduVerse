import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number, 
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  
  imageUrl: {
    type: String,
    default: "", 
  },
  
  imageFile: {
    type: String,
    default: "", 
  },
});

export default mongoose.model("Course", courseSchema);
