
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

export const markAttendance = async (req, res) => {
  try {
    const { journalId, studentName, status } = req.body;

    const journal = await Journal.findById(journalId).populate("records.student", "name");
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const record = journal.records.find(r => r.student.name === studentName);
    if (!record) return res.status(404).json({ message: "Tələbə tapılmadı" });

    record.attendance = status;
    await journal.save();

    res.status(200).json({ message: "İştirak yeniləndi", updatedRecord: record });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const addSummative = async (req, res) => {
  try {
    const { journalId, studentName, score } = req.body;

    if (score < 0 || score > 100) {
      return res.status(400).json({ message: "Summativ 0-100 arası olmalıdır" });
    }

    const journal = await Journal.findById(journalId).populate("records.student", "name");
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const record = journal.records.find(r => r.student.name === studentName);
    if (!record) return res.status(404).json({ message: "Tələbə tapılmadı" });

    const grade = getGradeFromScore(score);
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
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};

export const setBSQAndCalculateFinal = async (req, res) => {
  try {
    const { journalId, scores } = req.body; 

    const journal = await Journal.findById(journalId).populate("records.student", "name");
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const finalResults = [];

    for (const { studentName, bsq } of scores) {
      const record = journal.records.find(r => r.student.name === studentName);
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
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};

export const getJournalBySubject = async (req, res) => {
  try {
    const { className, subject } = req.params;
    const teacherId = req.user.id;

    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "");
    const classObj = await Class.findOne({ grade, section });
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

    const journal = await Journal.findOne({
      classId: classObj._id,
      subject,
      teacher: teacherId
    })
      .populate("teacher", "name")
      .populate("classId", "grade section sector")
      .populate("records.student", "name");

    if (!journal) return res.status(404).json({ message: "Bu fənn üçün jurnal tapılmadı" });

    res.status(200).json({ journal });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi"});
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
    res.status(500).json({ message: "Server xətası" });
  }
};
export const updateJournalTopic = async (req, res) => {
  try {
    const { journalId, topic, date } = req.body;

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    if (topic) journal.topic = topic;
    if (date) journal.date = date;

    await journal.save();
    res.status(200).json({ message: "Jurnal mövzusu yeniləndi", topic: journal.topic, date: journal.date });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};export const getJournalByDate = async (req, res) => {
  try {
    const { date, className } = req.query;
    const teacherId = req.user.id;

    if (!date || !className) {
      return res.status(400).json({ message: "Tarix və sinif adı tələb olunur" });
    }

    const [gradeSection, sector] = className.split("-");
    const grade = parseInt(gradeSection);
    const section = gradeSection.replace(/[0-9]/g, "");

    const foundClass = await Class.findOne({ grade, section, sector });
    if (!foundClass) return res.status(404).json({ message: "Sinif tapılmadı" });

    const journal = await Journal.findOne({
      teacher: teacherId,
      classId: foundClass._id,
      date: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) }
    })
    .populate("records.student", "name")
    .populate("teacher", "name")
    .populate("classId", "grade section sector");

    if (!journal) return res.status(404).json({ message: "Bu tarix üçün jurnal tapılmadı" });

    res.status(200).json({ journal });
  } catch (error) {
    console.error("Journal by date error:", error);
    res.status(500).json({ message: "Server xətası"});
  }
};
export const addHomeworkByTeacher = async (req, res) => {
  try {
    const { className, subject, homeworkText, date } = req.body;
    const teacherId = req.user.id;

    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "") || "";

    const classObj = await Class.findOne({ grade, section });
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

    const journal = await Journal.findOne({
      classId: classObj._id,
      subject,
      date: { $gte: new Date(date).setHours(0,0,0,0), $lt: new Date(date).setHours(23,59,59,999) },
      teacher: teacherId
    });

    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    journal.records.forEach(rec => {
      if (!rec.homework) rec.homework = {};
      rec.homework.text = homeworkText;
    });

    await journal.save();

    res.status(200).json({ message: "Tapşırıq uğurla əlavə edildi." });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
export const submitHomeworkByStudent = async (req, res) => {
  try {
    const { className, subject, date, homeworkText } = req.body;
    const file = req.file?.filename || "";
    const studentId = req.user.id;

    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "") || "";

    const classObj = await Class.findOne({ grade, section });
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

    const journal = await Journal.findOne({
      classId: classObj._id,
      subject,
      date: { $gte: new Date(date).setHours(0,0,0,0), $lt: new Date(date).setHours(23,59,59,999) }
    });

    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const record = journal.records.find(r => r.student.toString() === studentId);
    if (!record) return res.status(404).json({ message: "Şagird üçün qeyd tapılmadı" });

    record.homework = {
      text: homeworkText || "",
      file: file ? `/uploads/${file}` : ""
    };

    await journal.save();

    res.status(200).json({ message: "Tapşırıq uğurla göndərildi" });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
export const gradeHomework = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { className, subject, studentName, grade } = req.body;

    const gradeNum = parseInt(className);
    const section = className.replace(/[0-9]/g, "") || "";

    const classObj = await Class.findOne({ grade: gradeNum, section });
    if (!classObj) return res.status(404).json({ message: "Sinif tapılmadı" });

    const student = await User.findOne({ name: studentName, role: "student" });
    if (!student) return res.status(404).json({ message: "Şagird tapılmadı" });

    const journal = await Journal.findOne({
      classId: classObj._id,
      subject,
      teacher: teacherId
    });
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const record = journal.records.find(r => r.student.toString() === student._id.toString());
    if (!record) return res.status(404).json({ message: "Şagird jurnalda tapılmadı" });

    record.homework.grade = grade;
    await journal.save();

    res.status(200).json({ message: "Tapşırığa qiymət verildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
export const updateJournal = async (req, res) => {
  try {
    const { journalId } = req.params;
    const { topic, records } = req.body;

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    journal.topic = topic || journal.topic;
    journal.records = records; 
    await journal.save();

    res.status(200).json({ message: "Jurnal uğurla yeniləndi", journal });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};