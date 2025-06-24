
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
    const { journalId, studentId, status } = req.body;

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const record = journal.records.find(r => r.student.toString() === studentId);
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
    const { journalId, studentId, score, term } = req.body;
    if (!["term1", "term2"].includes(term))
      return res.status(400).json({ message: "Yanlış yarımil seçimi" });

    if (score < 0 || score > 100)
      return res.status(400).json({ message: "Summativ 0-100 arası olmalıdır" });

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const record = journal.records.find(r => r.student.toString() === studentId);
    if (!record) return res.status(404).json({ message: "Şagird tapılmadı" });

    const grade = getGradeFromScore(score);
    const date = new Date();

    record[term].summatives.push({ score, grade, date });

    const scores = record[term].summatives.map(s => s.score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    record[term].average = avg;
    record[term].grade = getGradeFromScore(avg);

    await journal.save();

    res.status(200).json({
      message: `Summativ (${term}) əlavə olundu`,
      summatives: record[term].summatives,
      average: record[term].average,
      grade: record[term].grade
    });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
export const calculateFinalResults = async (req, res) => {
  try {
    const { journalId } = req.body;
    const journal = await Journal.findById(journalId);

    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    for (let record of journal.records) {
      const t1 = record.term1;
      const t2 = record.term2;

      if (!t1.average || !t1.bsq?.score || !t2.average || !t2.bsq?.score) continue;

      const term1Score = Math.round(t1.average * 0.4 + t1.bsq.score * 0.6);
      const term2Score = Math.round(t2.average * 0.4 + t2.bsq.score * 0.6);

      const finalScore = Math.round((term1Score + term2Score) / 2);
      const finalGrade = getGradeFromScore(finalScore);

      record.final = {
        score: finalScore,
        grade: finalGrade
      };
    }

    await journal.save();

    res.status(200).json({ message: "İllik nəticələr hesablandı", journal });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};



export const getJournalBySubject = async (req, res) => {
  try {
    const { className, subject } = req.params;
    const teacherId = req.user.id;

    const grade = parseInt(className);
    const section = className.replace(/[0-9]/g, "") || "";

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
    console.error("Jurnal gətirərkən xəta:", error);
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
    const { journalId } = req.body;
    const homeworkText = req.body.homeworkText || "";
    const file = req.file;

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    // Yuxarı səviyyəyə tapşırıq əlavə et
    journal.homework = {
      text: homeworkText,
      file: file ? `/uploads/${file.filename}` : ""
    };

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

export const addBSQScore = async (req, res) => {
  try {
    const { journalId, studentId, score, term } = req.body;

    if (!["term1", "term2"].includes(term)) {
      return res.status(400).json({ message: "Yanlış yarımil seçimi" });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({ message: "Qiymət 0-100 arası olmalıdır" });
    }

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ message: "Jurnal tapılmadı" });

    const record = journal.records.find(r => r.student.toString() === studentId);
    if (!record) return res.status(404).json({ message: "Şagird tapılmadı" });

    const grade = getGradeFromScore(score);

    // BSQ-ni təyin et
    record[term].bsq = { score, grade };

    // Əgər artıq summativ ortalama mövcuddursa, ortalama + bsq ilə yeni nəticə çıxar
    const termAvg = record[term].average;
    if (termAvg && score) {
      const weighted = Math.round(termAvg * 0.4 + score * 0.6);
      record[term].average = weighted;
      record[term].grade = getGradeFromScore(weighted);
    }

    await journal.save();

    res.status(200).json({ message: `BŞQ (${term}) əlavə edildi`, record: record[term] });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
