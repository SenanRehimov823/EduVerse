import Quiz from "../model/quiz.js";
import Class from "../model/class.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, className, subject, questions } = req.body;
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
      questions
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
      .populate("classId", "grade section")
      .select("-questions.correctAnswer"); // cavablar şagirdlərə göstərilməsin

    res.status(200).json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
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
    res.status(500).json({ message: "Server xətası" });
  }
};
