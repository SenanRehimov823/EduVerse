import ClassGroupChat from "../model/classGroupChat.js";
import Class from "../model/class.js";
import Subject from "../model/subject.js";
import User from "../model/user.js";

export const createClassGroupChat = async (req, res) => {
  try {
    const { classId, subjectId } = req.body;

   
    const classItem = await Class.findById(classId).populate('students teacher');
    if (!classItem) return res.status(404).json({ message: "Sinif tapılmadı" });

    const subjectItem = await Subject.findById(subjectId);
    if (!subjectItem) return res.status(404).json({ message: "Fənn tapılmadı" });

    
    const teacher = classItem.teacher;
    const headTeacher = classItem.teacher; 
    const students = classItem.students;

    const exists = await ClassGroupChat.findOne({ class: classId, subject: subjectId });
    if (exists) return res.status(409).json({ message: "Bu sinif və fənn üçün qrup artıq var" });

    const newGroup = await ClassGroupChat.create({
      class: classId,
      subject: subjectId,
      students,
      teacher,
      headTeacher
    });

    res.status(201).json({
      message: "Qrup uğurla yaradıldı",
      group: newGroup
    });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};