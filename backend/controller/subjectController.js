import Subject from "../model/subject.js";

export const createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Subject.findOne({ name });
    if (existing) return res.status(400).json({ message: "Fənn artıq mövcuddur" });

    const subject = new Subject({ name });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: "Xəta baş verdi", error: err.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort("name");
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};
