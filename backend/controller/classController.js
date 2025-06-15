import Class from "../model/class.js";
import User from "../model/user.js";
import ClassGroupChat from "../model/classGroupChat.js";


export const createClass = async (req, res) => {
  try {
    const { name, headTeacherName, studentNames } = req.body;

    if (!name || !headTeacherName || !Array.isArray(studentNames)) {
      return res.status(400).json({ message: "Bütün xanaları doldurun" });
    }

    const headTeacher = await User.findOne({ name: headTeacherName, role: "teacher" });
    if (!headTeacher) {
      return res.status(404).json({ message: "Rəhbər müəllim tapılmadı" });
    }

    const grade = parseInt(name);
    const section = name.replace(/[0-9]/g, "") || "";
    const sector = "";

    const existingClass = await Class.findOne({ grade, section, sector });
    if (existingClass) {
      return res.status(400).json({ message: "Bu adda sinif artıq mövcuddur" });
    }

    const students = await User.find({ name: { $in: studentNames }, role: "student" });
    const studentIds = students.map(s => s._id);

    const newClass = new Class({
      grade,
      section,
      sector,
      teacher: headTeacher._id,
      students: studentIds,
    });

    await newClass.save();

    await User.updateMany(
      { _id: { $in: studentIds } },
      { $set: { class: newClass._id } }
    );

    const uniqueNames = [...new Set(students.map(s => s.name))];

    res.status(201).json({
      message: "Sinif yaradıldı və rəhbər + şagirdlər təyin olundu.",
      addedStudents: uniqueNames,
    });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};


const parseClassName = (className) => {
  const grade = parseInt(className);
  const section = className.replace(/[0-9]/g, "") || null;
  return { grade, section };
};


export const assignTeacherToClass = async (req, res) => {
  try {
    const { className, teacherName } = req.body;
    const { grade, section } = parseClassName(className);

    const foundClass = await Class.findOne({ grade, section });
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    const teacher = await User.findOne({ name: teacherName, role: "teacher" });
    if (!teacher) return res.status(404).json({ message: "Müəllim tapılmadı" });

    foundClass.teacher = teacher._id;
    await foundClass.save();
    await foundClass.populate("teacher", "name");

    const subjectChats = await ClassGroupChat.find({ class: foundClass._id });
    for (const chat of subjectChats) {
      chat.teacher = teacher._id;
      await chat.save();
    }

    res.status(200).json({ message: "Müəllim sinifə və bütün fənn chatlarına əlavə olundu", class: foundClass });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};


export const assignStudentToClass = async (req, res) => {
  try {
    const { className, studentName } = req.body;
    const { grade, section } = parseClassName(className);

    const foundClass = await Class.findOne({ grade, section });
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    const student = await User.findOne({ name: studentName, role: "student" });
    if (!student) return res.status(404).json({ message: "Şagird tapılmadı" });

    if (foundClass.students.includes(student._id)) {
      return res.status(400).json({ message: "Şagird artıq bu sinifdədir" });
    }

    foundClass.students.push(student._id);
    await foundClass.save();

   
    const subjectChats = await ClassGroupChat.find({ class: foundClass._id });
    for (const chat of subjectChats) {
      if (!chat.students.includes(student._id)) {
        chat.students.push(student._id);
        await chat.save();
      }
    }

    await foundClass.populate("students", "name");
    res.status(200).json({ message: "Şagird sinifə və bütün fənn chatlarına əlavə olundu", class: foundClass });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};


export const assignMultipleStudentsToClass = async (req, res) => {
  try {
    const { className, studentNames } = req.body; 

    const [gradeStr, section] = className.match(/^(\d+)([A-Z]*)$/).slice(1);
    const grade = parseInt(gradeStr);

    const foundClass = await Class.findOne({ grade, section });
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    const addedStudents = [];
    const addedStudentIds = [];

    for (const name of studentNames) {
      const student = await User.findOne({ name, role: "student" });
      if (!student) continue;

      if (!foundClass.students.includes(student._id)) {
        foundClass.students.push(student._id);
        addedStudents.push(student.name);
        addedStudentIds.push(student._id);
      }
    }

    await foundClass.save();

    
    const subjectChats = await ClassGroupChat.find({ class: foundClass._id });
    for (const chat of subjectChats) {
      for (const studentId of addedStudentIds) {
        if (!chat.students.includes(studentId)) {
          chat.students.push(studentId);
        }
      }
      await chat.save();
    }

    await foundClass.populate("students", "name");
    await foundClass.populate("teacher", "name");

    res.status(200).json({
      message: "Şagirdlər sinifə və bütün fənn chatlarına əlavə olundu",
      addedStudents,
      class: foundClass,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};


export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teacher", "name")
      .populate("students", "name");

    const classesWithCount = classes.map(cls => ({
      ...cls.toObject(),
      studentCount: cls.students.length,
    }));

    res.status(200).json({ classes: classesWithCount });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};


export const removeTeacherFromClass = async (req, res) => {
  try {
    const { className } = req.params;

    const [gradeSection, sector] = className.split("-");
    const grade = parseInt(gradeSection);
    const section = gradeSection.replace(/[0-9]/g, "");

    const foundClass = await Class.findOne({ grade, section, sector });
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    foundClass.teacher = undefined;
    await foundClass.save();

   
    const subjectChats = await ClassGroupChat.find({ class: foundClass._id });
    for (const chat of subjectChats) {
      chat.teacher = undefined;
      await chat.save();
    }

    res.status(200).json({ message: "Müəllim sinifdən və bütün fənn chatlarından silindi", class: foundClass });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};


export const deleteClass = async (req, res) => {
  try {
    const { className } = req.params;

    const [gradeSection, sector] = className.split("-");
    const grade = parseInt(gradeSection);
    const section = gradeSection.replace(/[0-9]/g, "");

    const foundClass = await Class.findOne({ grade, section, sector });
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    
    await ClassGroupChat.deleteMany({ class: foundClass._id });

    await Class.findByIdAndDelete(foundClass._id);
    res.status(200).json({ message: "Sinif və əlaqəli fənn chatları uğurla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};