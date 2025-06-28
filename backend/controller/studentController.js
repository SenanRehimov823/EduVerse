import Lesson from "../model/lesson.js";
import QuizResult from "../model/quizResult.js";
import Journal from "../model/journal.js";
import Quiz from "../model/quiz.js";
import User from "../model/user.js";
import multer from "multer";
import Subject from "../model/subject.js";

export const getMySubjects = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Şagirdi tapıb sinfini yükləyirik
    const student = await User.findById(studentId).populate("class");

    // O sinfə aid olan dərsləri tapırıq
    const lessons = await Lesson.find({ class: student.class._id }) 
      .populate("teacher", "name")
      .populate("subject", "name")
      .populate("class", "grade section sector") // ✨ burada lazım olan hissələri yükləyirik
      .select("subject teacher class");

    // Formatlanmış cavab
    const formattedSubjects = lessons.map(lesson => ({
      _id: lesson._id,
      subject: lesson.subject,
      teacher: lesson.teacher,
      className: `${lesson.class.grade}${lesson.class.section || ""}${lesson.class.sector || ""}`, // ✨ sinif adı formatı
    }));

    // Debug üçün log
    console.log("🎓 Backenddən göndərilən fənlər:", formattedSubjects);

    res.status(200).json({ subjects: formattedSubjects });
  } catch (error) {
    console.error("🚨 getMySubjects xətası:", error);
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};






export const getMyJournalBySubject = async (req, res) => {
  try {
    const studentId = req.user.id;
    const subjectName = req.params.subject;

    const student = await User.findById(studentId).populate("class");
    if (!student || !student.class) {
      return res.status(404).json({ message: "Şagird və ya sinif tapılmadı" });
    }

    const subject = await Subject.findOne({ name: new RegExp(`^${subjectName}$`, "i") });
    if (!subject) {
      return res.status(404).json({ message: "Fənn tapılmadı" });
    }

    const lesson = await Lesson.findOne({
      class: student.class._id,
      subject: subject._id
    }).populate("subject teacher");

    if (!lesson || !lesson.teacher || !lesson.subject) {
      return res.status(404).json({ message: "Dərs və ya əlaqəli müəllim/fənn tapılmadı" });
    }

    const journalEntries = await Journal.find({
      classId: student.class._id,
      subjectId: subject._id
    });

    const records = journalEntries.map(journal => {
      const record = journal.records.find(r => r.student.toString() === studentId);
      return {
        date: journal.date,
        attendance: record?.attendance || "Qeydə alınmayıb",
        term1: record?.term1 || {
          summatives: [],
          bsq: { score: null, grade: null },
          average: null
        },
        term2: record?.term2 || {
          summatives: [],
          bsq: { score: null, grade: null },
          average: null
        },
        final: record?.final || { score: null, grade: null },
        homework: record?.homework || { file: null, grade: null }
      };
    });

    res.status(200).json({
      teacherName: lesson.teacher.name,
      subject: lesson.subject.name,
      records
    });
  } catch (err) {
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};

export const getMyQuizResultsBySubject = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subject } = req.params;

    const quizzes = await Quiz.find({ subject });
    const quizIds = quizzes.map(q => q._id);

    const results = await QuizResult.find({
      quiz: { $in: quizIds },
      student: studentId
    }).populate("quiz", "title deadline");

    const formatted = results.map(r => ({
      title: r.quiz.title,
      score: r.score,
      deadline: r.quiz.deadline
    }));

    res.status(200).json({ subject, results: formatted });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
export const getMySubjectAverages = async (req, res) => {
  try {
    const studentId = req.user.id;
    const quizzes = await QuizResult.find({ student: studentId }).populate("quiz", "subject");

    const subjectGroups = {};
    quizzes.forEach(q => {
      const subject = q.quiz.subject;
      if (!subjectGroups[subject]) subjectGroups[subject] = [];
      subjectGroups[subject].push(q.score);
    });

    const averages = Object.entries(subjectGroups).map(([subject, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { subject, averageScore: avg.toFixed(2) };
    });

    res.status(200).json({ averages });
  } catch (err) {
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate("class", "grade section");
    res.status(200).json({
      name: student.name,
      surname: student.surname,
      email: student.email,
      image: student.image,
      className: student.class ? `${student.class.grade}${student.class.section}` : null,
       role: student.role
    });
  } catch (err) {
    res.status(500).json({ message: "Xəta baş verdi", error: err.message });
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage }).single("image");

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Şəkil seçilməyib" });

    await User.findByIdAndUpdate(req.user.id, {
      image: `/uploads/${req.file.filename}`,
    });

    res.status(200).json({ message: "Şəkil yeniləndi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};



export const getActiveQuizzes = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate("class");
    const allQuizzes = await Quiz.find({
      classId: student.class._id,
      deadline: { $gt: new Date() },
    });

    const taken = await QuizResult.find({ student: student._id });
    const takenIds = taken.map(t => t.quiz.toString());

    const active = allQuizzes.filter(q => !takenIds.includes(q._id.toString()));
    res.status(200).json({ active });
  } catch (err) {
    res.status(500).json({ message: "Xəta baş verdi", error: err.message });
  }
};

export const getQuizDetailsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate("teacher", "name");
    const result = await QuizResult.findOne({ quiz: quizId, student: studentId });
    if (!result) return res.status(404).json({ message: "Cavab tapılmadı" });

    const details = quiz.questions.map((q, idx) => {
      const a = result.answers.find(a => a.questionIndex === idx);
      return {
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers,
        selectedOptions: a ? a.selectedOptions : [],
      };
    });

    res.status(200).json({
      quizTitle: quiz.title,
      teacher: quiz.teacher.name,
      score: result.score,
      answers: details,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
export const getHomeworkBySubject = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subjectName } = req.params;

    const journals = await Journal.find({
      subject: subjectName,
      "records.student": studentId,
      "records.homework.file": { $ne: "" }
    }).sort({ date: -1 });
    const homeworks = journals.map(j => {
      const r = j.records.find(r => r.student.toString() === studentId);
      return {
        date: j.date,
        topic: j.topic,
        homeworkText: r.homework.text,
        fileUrl: r.homework.file
      };
    });
    res.status(200).json({ subject: subjectName, homeworks });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};