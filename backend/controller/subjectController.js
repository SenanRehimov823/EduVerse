import Subject from "../model/subject.js";
import User from "../model/user.js";
export const createSubject = async (req, res) => {
  try {
    const { subjectName, teacherId } = req.body;

    if (!subjectName || !teacherId) {
      return res.status(400).json({ message: "Fənn və müəllim seçilməlidir" });
    }


    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Müəllim tapılmadı" });
    }


    let subject = await Subject.findOne({ name: subjectName });

    if (!subject) {
      subject = new Subject({
        name: subjectName,
        teacher: teacherId
      });
      await subject.save();
    } else {
      subject.teacher = teacherId;
      await subject.save();
    }

    
    teacher.subjectName = subjectName;
    await teacher.save();

    res.status(201).json({ message: "Fənn yaradıldı və müəllimə təyin olundu" });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort("name");
    res.status(200).json({ subjects }); 
  } catch (err) {
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};
