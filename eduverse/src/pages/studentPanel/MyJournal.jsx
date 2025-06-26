import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router"; 

const MyJournal = () => {
  const [journals, setJournals] = useState([]);
  const location = useLocation();
  const subjectFromState = location.state?.subject || "";
  const [selectedSubject, setSelectedSubject] = useState(subjectFromState);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/journal/my", {
          withCredentials: true,
        });
        setJournals(res.data.journals || []);
      } catch (err) {
        console.error("Jurnallar yüklənmədi:", err);
      }
    };
    fetchJournals();
  }, []);

  const filtered = journals.filter((j) => j.subject === selectedSubject);

  return (
    <div>
      <h2>📓 Mənim Jurnallarım</h2>
      <h5 style={{ margin: "15px 0" }}>
        <strong>Fənn:</strong> {selectedSubject}
      </h5>

      {filtered.length > 0 ? (
        <table border="1" cellPadding="5" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Tarix</th>
              <th>Fənn</th>
              <th>Mövzu</th>
              <th>Müəllim</th>
              <th>İştirak</th>
              <th>I Yarıil</th>
              <th>II Yarıil</th>
              <th>İllik nəticə</th>
              <th>Tapşırıq</th>
              <th>Tapşırıq Qiyməti</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j, idx) => (
              <tr key={idx}>
                <td>{new Date(j.date).toLocaleDateString("az-AZ")}</td>
                <td>{j.subject}</td>
                <td>{j.topic || "-"}</td>
                <td>{j.teacher?.name || "-"}</td>
                <td>{j.record?.attendance || "-"}</td>
                <td>
                  {j.record?.term1?.summatives?.map((s, i) => (
                    <div key={i}>{s.score} ({s.grade})</div>
                  )) || "-"}
                  <br />
                  Ort.: {j.record?.term1?.average ?? "-"} ({j.record?.term1?.grade ?? "-"})
                  <br />
                  BŞQ: {j.record?.term1?.bsq?.score ?? "-"} ({j.record?.term1?.bsq?.grade ?? "-"})
                </td>
                <td>
                  {j.record?.term2?.summatives?.map((s, i) => (
                    <div key={i}>{s.score} ({s.grade})</div>
                  )) || "-"}
                  <br />
                  Ort.: {j.record?.term2?.average ?? "-"} ({j.record?.term2?.grade ?? "-"})
                  <br />
                  BŞQ: {j.record?.term2?.bsq?.score ?? "-"} ({j.record?.term2?.bsq?.grade ?? "-"})
                </td>
                <td>{j.record?.final?.score ?? "-"} ({j.record?.final?.grade ?? "-"})</td>
                <td>
                  {j.record?.homework?.file ? (
                    <a
                      href={`http://localhost:5000${j.record.homework.file}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Bax
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{j.record?.homework?.grade ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: 20 }}>Bu fənn üzrə jurnal tapılmadı.</p>
      )}
    </div>
  );
};

export default MyJournal;
