import Lesson from "../model/lesson.js";
import Class from "../model/class.js";
import Subject from "../model/subject.js";
import User from "../model/user.js";
import Journal from "../model/journal.js";


export const createLessonWithJournal = async (req, res) => {
  try {
    const { subjectName, className, teacherName } = req.body;
    const requesterId = req.user.id;

    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "") || null;

    const classObj = await Class.findOne({ grade, section }).populate("students", "_id name");
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

   
    if (classObj.headTeacher?.toString() !== requesterId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Bu sinfə yalnız rəhbəri və ya admin fənn əlavə edə bilər" });
    }

    const subject = await Subject.findOne({ name: subjectName });
    if (!subject) return res.status(404).json({ message: "Fənn tapılmadı" });

    const teacher = await User.findOne({ name: teacherName, role: "teacher", subject: subject._id });
    if (!teacher) return res.status(404).json({ message: "Müəllim tapılmadı və ya bu fənni tədris etmir" });

    const alreadyExists = await Lesson.findOne({
      class: classObj._id,
      subject: subject._id,
    });
    if (alreadyExists) {
      return res.status(400).json({ message: "Bu sinif üçün bu fənn artıq mövcuddur" });
    }

    const lesson = await Lesson.create({
      subject: subject._id,
      class: classObj._id,
      teacher: teacher._id,
    });

    const records = classObj.students.map(s => ({
      student: s._id,
      summatives: [],
      bsq: null,
      midtermAverage: null,
      midtermGrade: null,
      finalScore: null,
      finalGrade: null,
      homework: ""
    }));

    const journal = await Journal.create({
      classId: classObj._id,
      teacher: teacher._id,
      subject: subject.name,
      topic: "",
      records
    });

    await journal.populate([
      { path: "teacher", select: "name" },
      { path: "records.student", select: "name" }
    ]);

    res.status(201).json({
      message: "Fənn və jurnal yaradıldı",
      lesson,
      journal
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const getLessonsByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const lessons = await Lesson.find({ teacher: teacherId })
      .populate("subject", "name")
      .populate("class", "name");

    const formatted = lessons.map(lesson => ({
      subject: lesson.subject.name,
      className: lesson.class.name,
      createdAt: lesson.createdAt,
    }));

    res.status(200).json({ lessons: formatted });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};


export const getLessonsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const userId = req.user.id;

    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "") || null;

    const classDoc = await Class.findOne({ grade, section });
    if (!classDoc) return res.status(404).json({ message: "Sinif tapılmadı" });

    if (classDoc.headTeacher?.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Bu sinifin dərslərini görmək icazəniz yoxdur" });
    }

    const lessons = await Lesson.find({ class: classDoc._id })
      .populate("subject", "name")
      .populate("teacher", "name");

    const formatted = lessons.map(lesson => ({
      subject: lesson.subject.name,
      teacher: lesson.teacher.name,
      createdAt: lesson.createdAt,
    }));

    res.status(200).json({ lessons: formatted });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
