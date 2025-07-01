import Quiz from "../model/quiz.js";
import QuizResult from "../model/quizResult.js";
import Class from "../model/class.js";
import User from "../model/user.js";



export const submitQuiz = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { quizId, answers } = req.body;

    console.log("📩 Gələn quizId:", quizId);
    console.log("📥 Gələn cavablar:", answers);

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz tapılmadı" });

    const now = Date.now();
    if (quiz.deadline && now > new Date(quiz.deadline)) {
      return res.status(400).json({ message: "Vaxt bitib. Quiz artıq təqdim edilə bilməz." });
    }

    const existing = await QuizResult.findOne({ quiz: quizId, student: studentId });
    if (existing) return res.status(400).json({ message: "Artıq təqdim etmisiniz" });

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
        correctAnswers: correct, // ✅ Bunu əlavə edirik!
      };
    });

    console.log("✅ Yekun bal:", score);
    console.log("📊 Cavab xəritəsi:", answerMapping);

    const result = await QuizResult.create({
      quiz: quizId,
      student: studentId,
      answers: answerMapping,
      score,
      startTime: Date.now()
    });

    res.status(201).json({ message: "Quiz təqdim edildi", result });
  } catch (error) {
    console.error("❌ Server xətası:", error);
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};


export const getResultsByQuizIdForTeacher = async (req, res) => {
  try {
    const { quizId } = req.params;
    const teacherId = req.user.id;

    console.log("🧑‍🏫 teacherId from token:", teacherId);
    console.log("📩 Requested quizId:", quizId);

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.log("❌ Quiz tapılmadı:", quizId);
      return res.status(404).json({ message: "Quiz tapılmadı" });
    }

    console.log("📌 quiz.teacher:", quiz.teacher);
    console.log("📌 String(quiz.teacher):", String(quiz.teacher));
    console.log("📌 String(teacherId):", String(teacherId));
    console.log("📌 Eynilik yoxlanışı:", String(quiz.teacher) === String(teacherId));

    if (String(quiz.teacher) !== String(teacherId)) {
      console.log("❌ Bu quiz bu müəllimə aid deyil!");
      return res.status(403).json({ message: "Bu quiz sizin deyil" });
    }

    const classObj = await Class.findById(quiz.classId).populate("students", "name");
    if (!classObj) {
      console.log("❌ Sinif tapılmadı:", quiz.classId);
      return res.status(404).json({ message: "Sinif tapılmadı" });
    }

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
    console.error("❌ SERVER ERROR:", err);
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};


export const getQuizStats = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz tapılmadı" });

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
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};

export const getQuizDetailsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate("teacher", "name");
    if (!quiz) return res.status(404).json({ message: "Quiz tapılmadı" });

    const result = await QuizResult.findOne({ quiz: quizId, student: studentId });
    if (!result) {
      return res.status(404).json({ message: "Siz bu quizə cavab verməmisiniz" });
    }

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
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
export const getActiveQuizzesForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await User.findById(studentId).populate("class", "_id");
    if (!student || !student.class) {
      return res.status(404).json({ message: "Sinif tapılmadı" });
    }

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
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
