import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const MySubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/subjects", {
          withCredentials: true,
        });
        console.log("🎓 Backenddən gələn fənlər:", res.data.subjects);
        setSubjects(res.data.subjects || []);
      } catch {
        setError("Fənlər yüklənmədi");
      }
    };
    fetchSubjects();
  }, []);

  const goToJournal = (subjectName) => {
    navigate("/student/my-journals", {
      state: { subject: subjectName },
    });
  };

  const goToMergedChat = (subjectName, className) => {
    if (!className) {
      alert("Sinif adı tapılmadı!");
      return;
    }
    console.log("🔗 Navigasiya edilir:", subjectName, className);
    navigate(`/merged-chat-room?subject=${subjectName}&className=${className}`);
  };

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📚 Fənlərim</h2>
      <div className="row">
        {subjects.map((item, index) => (
          <div className="col-md-6" key={index}>
            <div className="card mb-3 p-3 shadow-sm">
              <h5><strong>Fənn:</strong> {item.subject.name}</h5>
              <p><strong>Müəllim:</strong> {item.teacher.name}</p>
              <p><strong>Sinif:</strong> {item.className}</p>
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => goToJournal(item.subject.name)}
                >
                  📖 Jurnalım
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => goToMergedChat(item.subject.name, item.className)}
                >
                  💬 Müştərək Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySubjects;
