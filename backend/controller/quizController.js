import Quiz from "../model/quiz.js";
import Class from "../model/class.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, className, subject, questions, deadline } = req.body;
    const teacherId = req.user.id;

    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "") || "";

    const classObj = await Class.findOne({ grade, section });
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

    const quiz = await Quiz.create({
      title,
      classId: classObj._id,
      subject,
      teacher: teacherId,
      questions,
      deadline
    });

    res.status(201).json({ message: "Quiz yaradıldı", quiz });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const getQuizzesByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const quizzes = await Quiz.find({ teacher: teacherId })
      .populate("classId", "grade section");

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Quizləri yükləmək mümkün olmadı:", error);
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const quiz = await Quiz.findOne({ _id: id, teacher: teacherId });
    if (!quiz) return res.status(404).json({ message: "Quiz tapılmadı və ya icazəniz yoxdur" });

    await Quiz.findByIdAndDelete(id);
    res.status(200).json({ message: "Quiz silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const getAvailableQuizzesForStudent = async (req, res) => {
  try {
    const studentClassId = req.user.class;
    if (!studentClassId) return res.status(400).json({ message: "Sinif məlumatı yoxdur" });

    const quizzes = await Quiz.find({ classId: studentClassId })
      .populate("teacher", "name")
      .select("title subject questions deadline");

    res.status(200).json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    const { title, deadline, questions } = req.body;

    const quiz = await Quiz.findOne({ _id: id, teacher: teacherId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz tapılmadı və ya icazəniz yoxdur" });
    }

    if (title) quiz.title = title;
    if (deadline) quiz.deadline = deadline;
    if (questions) quiz.questions = questions;

    await quiz.save();
    res.status(200).json({ message: "Quiz yeniləndi", quiz });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
