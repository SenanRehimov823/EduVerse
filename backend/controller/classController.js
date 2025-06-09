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
await newClass.populate("teacher", "name");
    await newClass.save();

    res.status(201).json({ message: "Sinif yaradıldı", class: newClass });
  } catch (error) {
    res.status(500).json({ message: "Server xətası"});
  }
};



export const assignTeacherToClass = async (req, res) => {
  try {
    const { classId, teacherId } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({ message: "Etibarsız müəllim" });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { teacher: teacherId },
      { new: true }
    ).populate("teacher", "name"); 

    res.status(200).json({
      message: "Müəllim sinifə təyin olundu",
      class: updatedClass,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};



export const assignStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    const classObj = await Class.findById(classId);
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Şagird tapılmadı və ya rol düzgün deyil" });
    }

    
    if (classObj.students.includes(studentId)) {
      return res.status(400).json({ message: "Şagird artıq bu sinifdədir" });
    }

    classObj.students.push(studentId);
    await classObj.save();

    res.status(200).json({ message: "Şagird sinifə əlavə olundu", class: classObj });
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
    const { classId } = req.params;

    const foundClass = await Class.findById(classId);
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    foundClass.teacher = undefined;
    await foundClass.save();

    res.status(200).json({ message: "Müəllim sinifdən silindi", class: foundClass });
  } catch (error) {
    res.status(500).json({ message: "Server xətası"});
  }
};
export const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const foundClass = await Class.findById(classId);
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    await Class.findByIdAndDelete(classId);
    res.status(200).json({ message: "Sinif uğurla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};
export const assignMultipleStudentsToClass = async (req, res) => {
  try {
    const { classId, studentIds } = req.body;

    const foundClass = await Class.findById(classId);
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    const uniqueIds = studentIds.filter(id => !foundClass.students.includes(id));
    foundClass.students.push(...uniqueIds);
    await foundClass.save();

    
    await foundClass.populate("students", "name");
    await foundClass.populate("teacher", "name");

    res.status(200).json({ message: "Şagirdlər sinifə əlavə olundu", class: foundClass });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};
