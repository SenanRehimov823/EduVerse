import express from "express";
import { createSubject, getSubjects } from "../controller/subjectController.js";

const router = express.Router();

router.post("/create", createSubject); 
router.get("/", getSubjects);          

export default router;
