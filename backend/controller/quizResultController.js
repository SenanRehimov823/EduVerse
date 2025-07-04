import Quiz from "../model/quiz.js";
import QuizResult from "../model/quizResult.js";
import Class from "../model/class.js";
import User from "../model/user.js";

export const submitQuiz = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json();

    const now = Date.now();
    if (quiz.deadline && now > new Date(quiz.deadline)) {
      return res.status(400).json();
    }

    const existing = await QuizResult.findOne({ quiz: quizId, student: studentId });
    if (existing) return res.status(400).json();

    let score = 0;

    const answerMapping = quiz.questions.map((q, idx) => {
      const userAnswer = answers.find(a => a.questionIndex === idx);
      const selected = userAnswer ? userAnswer.selectedOptions.map(s => s.trim()) : [];
      const correct = q.correctAnswers.map(a => a.trim());

      const isCorrect = selected.sort().join(",") === correct.sort().join(",");
      if (isCorrect) score += 1;

      return {
        question: q.question,
        questionIndex: idx,
        selectedOptions: selected,
        correctAnswers: correct
      };
    });

    const result = await QuizResult.create({
      quiz: quizId,
      student: studentId,
      answers: answerMapping,
      score,
      startTime: Date.now()
    });

    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json();
  }
};

export const getResultsByQuizIdForTeacher = async (req, res) => {
  try {
    const { quizId } = req.params;
    const teacherId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json();

    if (String(quiz.teacher) !== String(teacherId)) {
      return res.status(403).json();
    }

    const classObj = await Class.findById(quiz.classId).populate("students", "name");
    if (!classObj) return res.status(404).json();

    const allResults = await QuizResult.find({ quiz: quizId }).populate("student", "name");

    const results = classObj.students.map(student => {
      const found = allResults.find(r => r.student._id.toString() === student._id.toString());

      return {
        studentName: student.name,
        score: found ? found.score : null,
        status: found ? (found.autoSubmitted ? "Vaxt bitdi (avtomatik)" : "Bitirib") : "Başlamayıb",
        answers: found ? found.answers : []
      };
    });

    res.status(200).json({
      quizTitle: quiz.title,
      class: { grade: classObj.grade, section: classObj.section },
      questions: quiz.questions.map((q, i) => ({
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers
      })),
      results
    });
  } catch (err) {
    res.status(500).json();
  }
};

export const getQuizStats = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json();

    const results = await QuizResult.find({ quiz: quizId }).populate("student", "name");

    const totalParticipants = results.length;
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = totalParticipants ? (totalScore / totalParticipants).toFixed(2) : 0;

    const topStudent = results.sort((a, b) => b.score - a.score)[0];

    res.status(200).json({
      participants: totalParticipants,
      averageScore,
      topStudent: topStudent ? {
        name: topStudent.student.name,
        score: topStudent.score
      } : null
    });
  } catch (error) {
    res.status(500).json();
  }
};

export const getQuizDetailsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate("teacher", "name");
    if (!quiz) return res.status(404).json();

    const result = await QuizResult.findOne({ quiz: quizId, student: studentId });
    if (!result) return res.status(404).json();

    const answers = quiz.questions.map((q, idx) => {
      const submitted = result.answers.find(a => a.questionIndex === idx);
      return {
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers,
        selectedOptions: submitted ? submitted.selectedOptions : []
      };
    });

    res.status(200).json({
      quizTitle: quiz.title,
      teacher: quiz.teacher.name,
      score: result.score,
      answers
    });
  } catch (error) {
    res.status(500).json();
  }
};

export const getActiveQuizzesForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await User.findById(studentId).populate("class", "_id");
    if (!student || !student.class) return res.status(404).json();

    const allQuizzes = await Quiz.find({
      classId: student.class._id,
      deadline: { $gt: new Date() }
    }).populate("teacher", "name");

    const submittedResults = await QuizResult.find({ student: studentId });
    const submittedQuizIds = submittedResults.map(r => r.quiz.toString());

    const activeQuizzes = allQuizzes
      .filter(q => !submittedQuizIds.includes(q._id.toString()))
      .map(q => ({
        _id: q._id,
        title: q.title,
        subject: q.subject,
        deadline: q.deadline,
        teacher: q.teacher.name,
        createdAt: q.createdAt
      }));

    res.status(200).json({ activeQuizzes });
  } catch (error) {
    res.status(500).json();
  }
};
