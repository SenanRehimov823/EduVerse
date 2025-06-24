import React, { useEffect, useState } from "react";
import axios from "axios";

const JournalTable = () => {
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState({ subject: "", className: "" });
  const [journal, setJournal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/lesson/by-teacher", {
          withCredentials: true,
        });
        setLessons(res.data.lessons || []);
      } catch {
        setError("Dərsləri yükləmək mümkün olmadı");
      }
    };
    fetchLessons();
  }, []);

  useEffect(() => {
    const fetchJournal = async () => {
      if (!selected.subject || !selected.className) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/journal/by-subject/${selected.className}/${selected.subject}`,
          { withCredentials: true }
        );
        setJournal(res.data.journal);
        setError("");
      } catch {
        setError("Jurnal tapılmadı və ya icazəniz yoxdur");
        setJournal(null);
      }
    };
    fetchJournal();
  }, [selected]);

  return (
    <div>
      <h2>Müəllim Jurnalı</h2>

      <select
        onChange={(e) => {
          const [subject, className] = e.target.value.split("|");
          setSelected({ subject, className });
        }}
      >
        <option value="">Dərs seç</option>
        {lessons.map((l, i) => (
          <option key={i} value={`${l.subject}|${l.className}`}>
            {l.subject} - {l.className}
          </option>
        ))}
      </select>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && journal && (
        <div style={{ marginTop: "20px" }}>
          <h4>{journal.subject} jurnalı</h4>
          <p>
            Mövzu: {journal.topic || "-"} | Tarix:{" "}
            {new Date(journal.date).toLocaleDateString("az-AZ")}
          </p>
          <p>
            Tapşırıq:{" "}
            {journal.records?.[0]?.homework?.text
              ? journal.records[0].homework.text
              : "-"}
          </p>

          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Şagird</th>
                <th>İştirak</th>
                <th>Summativlər</th>
                <th>Yarı il Ortalaması</th>
                <th>BŞQ</th>
                <th>Yekun Bal</th>
                <th>Tapşırıq Yükləməsi</th>
                <th>Tapşırıq Qiyməti</th>
              </tr>
            </thead>
            <tbody>
              {journal.records.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.student?.name || "-"}</td>
                  <td>{r.attendance || "-"}</td>
                  <td>
                    {r.summatives?.length > 0 ? (
                      r.summatives.map((s, i) => (
                        <div key={i}>
                          {s.score} ({s.grade})
                        </div>
                      ))
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {r.midtermAverage ?? "-"} ({r.midtermGrade ?? "-"})
                  </td>
                  <td>
                    {r.bsq?.score ?? "-"} ({r.bsq?.grade ?? "-"})
                  </td>
                  <td>
                    {r.finalScore ?? "-"} ({r.finalGrade ?? "-"})
                  </td>
                  <td>
                    {r.homework?.file ? (
                      <a href={r.homework.file} target="_blank" rel="noreferrer">
                        Bax
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {r.homework?.grade != null ? r.homework.grade : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JournalTable;
