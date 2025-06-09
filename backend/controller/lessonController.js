import Lesson from "../model/lesson.js";
import Class from "../model/class.js";
import Journal from "../model/journal.js";
import User from "../model/user.js";

export const createLessonWithJournal = async (req, res) => {
  try {
    const { name, className, teacherName } = req.body;
    const requesterId = req.user.id;

    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "") || null;

    const classObj = await Class.findOne({ grade, section }).populate("students", "_id name");
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

    if (classObj.teacher?.toString() !== requesterId) {
      return res.status(403).json({ message: "Bu sinfə yalnız rəhbəri fənn əlavə edə bilər" });
    }

  
    const alreadyExists = await Lesson.findOne({ name, classId: classObj._id });
    if (alreadyExists) {
      return res.status(400).json({ message: "Bu sinif üçün bu fənn artıq mövcuddur" });
    }

    const teacher = await User.findOne({ name: teacherName, role: "teacher" });
    if (!teacher) return res.status(404).json({ message: "Müəllim tapılmadı" });

    const lesson = await Lesson.create({ name, classId: classObj._id, teacher: teacher._id });

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
      subject: name,
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
    
    res.status(500).json({ message: "Server xətası" });
  }
};

export const getLessonsByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const lessons = await Lesson.find({ teacher: teacherId })
      .populate("classId", "grade section sector")
      .populate("teacher", "name");

    res.status(200).json({ lessons });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};


export const getJournalsByClassForTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { className } = req.params;

    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "") || null;

    const classObj = await Class.findOne({ grade, section });
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

    const journals = await Journal.find({
      classId: classObj._id,
      teacher: teacherId
    })
      .populate("classId", "grade section sector")
      .populate("records.student", "name")
      .populate("teacher", "name");

    res.status(200).json({ journals });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};


export const getAllLessonsInClassForSupervisor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { className } = req.params;
    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "");

    const classObj = await Class.findOne({ grade, section });
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

    if (classObj.teacher?.toString() !== userId) {
      return res.status(403).json({ message: "Bu sinifə yalnız rəhbəri baxa bilər" });
    }

    const lessons = await Lesson.find({ classId: classObj._id })
      .populate("teacher", "name")
      .populate("classId", "grade section sector");

    res.status(200).json({ lessons });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
