

import Class from "../model/class.js";
import User from "../model/user.js";


export const createClass = async (req, res) => {
  try {
    const { grade, sector, section } = req.body;

    if (!grade || !sector) {
      return res.status(400).json({ message: "Grade və sector tələb olunur" });
    }

    const newClass = new Class({
      grade,
      sector,
      section: section || null,
    });

    await newClass.save();
    res.status(201).json({ message: "Sinif yaradıldı", class: newClass });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
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

    res.status(200).json({ message: "Müəllim sinifə təyin olundu", class: foundClass });
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
await foundClass.populate("students", "name");
    res.status(200).json({ message: "Şagird sinifə əlavə olundu", class: foundClass });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
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

    res.status(200).json({ message: "Müəllim sinifdən silindi", class: foundClass });
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

    await Class.findByIdAndDelete(foundClass._id);
    res.status(200).json({ message: "Sinif uğurla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};
export const assignMultipleStudentsToClass = async (req, res) => {
  try {
    const { className, studentNames } = req.body; // studentNames: ["Elvin Tələbə", "Zaur Valideyn"]

    const [gradeStr, section] = className.match(/^(\d+)([A-Z]*)$/).slice(1);
    const grade = parseInt(gradeStr);

    const foundClass = await Class.findOne({ grade, section });
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    const addedStudents = [];

    for (const name of studentNames) {
      const student = await User.findOne({ name, role: "student" });
      if (!student) continue;

      if (!foundClass.students.includes(student._id)) {
        foundClass.students.push(student._id);
        addedStudents.push(student.name);
      }
    }

    await foundClass.save();
    await foundClass.populate("students", "name");
    await foundClass.populate("teacher", "name");

    res.status(200).json({
      message: "Şagirdlər sinifə əlavə olundu",
      addedStudents,
      class: foundClass,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};