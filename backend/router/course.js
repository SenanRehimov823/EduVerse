import express from "express";
import upload from "../middleware/upload.js"; 
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controller/courseController.js";

const router = express.Router();


router.post("/create", upload.single("image"), createCourse);

router.get("/", getAllCourses);


router.get("/:id", getCourseById);

router.put("/:id", upload.single("image"), updateCourse);


router.delete("/:id", deleteCourse);

export default router;
