import Journal from "../model/journal.js";
import Class from "../model/class.js";
import User from "../model/user.js";


const getGradeFromScore = (score) => {
  if (score >= 91) return 5;
  if (score >= 81) return 5;
  if (score >= 71) return 4;
  if (score >= 61) return 3;
  if (score >= 51) return 2;
  return 1;
};


export const createJournal = async (req, res) => {
  try {
    const { date, classId, subject, topic } = req.body;
    const teacherId = req.user.id;

    const foundClass = await Class.findById(classId).populate("students", "_id name");
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    const studentRecords = foundClass.students.map((student) => ({
      student: student._id,
      attendance: "etdi",
      summatives: [],
      bsq: null,
      midtermAverage: null,
      midtermGrade: null,
      finalScore: null,
      finalGrade: null,
      quiz: null,
      homework: ""
    }));

    const journal = await Journal.create({
      classId,
      teacher: teacherId,
      subject,
      topic,
      date,
      records: studentRecords
    });

    await journal.populate([
      { path: "teacher", select: "name" },
      { path: "records.student", select: "name" }
    ]);

    res.status(201).json({ message: "Jurnal yaradıldı", journal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xətası" });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { journalId, studentId, status } = req.body;

    if (!["etdi", "etmədi"].includes(status)) {
      return res.status(400).json({ message: "Düzgün iştirak statusu deyil" });
    }

    const journal = await Journal.findById(journalId).populate("records.student", "name");
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const record = journal.records.find(r => r.student._id.toString() === studentId);
    if (!record) return res.status(404).json({ message: "Tələbə tapılmadı" });

    record.attendance = status;
    await journal.save();

    res.status(200).json({ message: "İştirak yeniləndi", updatedRecord: record });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};


export const addSummative = async (req, res) => {
  try {
    const { journalId, studentId, score } = req.body;

    if (score < 0 || score > 100) {
      return res.status(400).json({ message: "Summativ 0-100 arası olmalıdır" });
    }

    const journal = await Journal.findById(journalId).populate("records.student", "name");
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const record = journal.records.find(r => r.student._id.toString() === studentId);
    if (!record) return res.status(404).json({ message: "Tələbə tapılmadı" });

    const grade = getGradeFromScore(score);
    if (!record.summatives) record.summatives = [];
    record.summatives.push({ score, grade });

    const scores = record.summatives.map(s => s.score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    record.midtermAverage = avg;
    record.midtermGrade = getGradeFromScore(avg);

    await journal.save();

    res.status(200).json({
      message: "Summativ əlavə olundu",
      summatives: record.summatives,
      midtermAverage: record.midtermAverage,
      midtermGrade: record.midtermGrade
    });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};


export const setBSQAndCalculateFinal = async (req, res) => {
  try {
    const { journalId, scores } = req.body;

    const journal = await Journal.findById(journalId).populate("records.student", "name");
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const finalResults = [];

    for (const { studentId, bsq } of scores) {
      const record = journal.records.find(r => r.student._id.toString() === studentId);
      if (!record || !record.midtermAverage) continue;

      record.bsq = {
        score: bsq,
        grade: getGradeFromScore(bsq)
      };

      const finalScore = Math.round((record.midtermAverage * 0.4) + (bsq * 0.6));
      const finalGrade = getGradeFromScore(finalScore);

      record.finalScore = finalScore;
      record.finalGrade = finalGrade;

      finalResults.push({
        student: record.student,
        finalScore,
        finalGrade
      });
    }

    await journal.save();

    res.status(200).json({
      message: "Yekun nəticələr hesablandı",
      results: finalResults
    });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};


export const getJournalById = async (req, res) => {
  try {
    const { id } = req.params;
    const journal = await Journal.findById(id)
      .populate("teacher", "name")
      .populate("classId", "grade section sector")
      .populate("records.student", "name");

    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    res.status(200).json({ journal });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};
export const getStudentJournals = async (req, res) => {
  try {
    const studentId = req.user.id;
    const classId = req.user.classId;

    const journals = await Journal.find({ classId })
      .populate("teacher", "name")
      .populate("classId", "grade section sector")
      .populate("records.student", "name");

   
    const filtered = journals.map(journal => {
      const myRecord = journal.records.find(
        r => r.student._id.toString() === studentId
      );
      if (!myRecord) return null;

      return {
        _id: journal._id,
        subject: journal.subject,
        topic: journal.topic,
        date: journal.date,
        teacher: journal.teacher,
        classId: journal.classId,
        record: myRecord
      };
    }).filter(j => j !== null);

    res.status(200).json({ journals: filtered });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
