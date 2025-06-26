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
        setSubjects(res.data.subjects || []);
      } catch {
        setError("Fənlər yüklənmədi");
      }
    };
    fetchSubjects();
  }, []);

  const goToJournal = (subjectName) => {
    navigate("/student/my-journals", {
      state: { subject: subjectName }, // state vasitəsilə göndəririk
    });
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
              <button
                className="btn btn-primary btn-sm mt-2"
                onClick={() => goToJournal(item.subject.name)}
              >
                📖 Jurnalım
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySubjects;
