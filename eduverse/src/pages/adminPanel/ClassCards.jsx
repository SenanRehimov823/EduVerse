import React, { useEffect, useState } from "react";
import axios from "axios";

const ClassCards = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sinifləri getir
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/class/all-classes", { withCredentials: true });
      setClasses(res.data.classes || []);
    } catch (err) {
      setError("Sinifləri yükləmək mümkün olmadı");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Sinif sil
  const handleDelete = async (cls) => {
    if (!window.confirm(`${cls.grade}${cls.section} sinifini silmək istədiyinizə əminsiniz?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/class/${cls.grade}${cls.section}`, { withCredentials: true });
      setClasses((prev) => prev.filter(c => !(c.grade === cls.grade && c.section === cls.section)));
    } catch (err) {
      alert("Sinifi silmək mümkün olmadı");
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p style={{color:'red'}}>{error}</p>;

  return (
    <div style={{display: "flex", flexWrap: "wrap", gap: "24px"}}>
      {classes.map(cls => (
        <div key={cls._id} style={{
          border: "1px solid #d1d1d1",
          borderRadius: "12px",
          padding: "18px",
          minWidth: "260px",
          background: "#fafcff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <h3 style={{margin:0}}>{cls.grade}{cls.section} sinfi</h3>
            <button onClick={() => handleDelete(cls)} style={{background:"none", border:"none", color:"red", fontSize:"18px", cursor:"pointer"}} title="Sil">✖</button>
          </div>
          <p>
            <b>Rəhbər müəllim:</b> {cls.teacher?.name || "Təyin olunmayıb"}
          </p>
          {/* Fənn müəllimləri əlavə etmək üçün, əgər varsa backenddə, göstərə bilərsən */}
          {/* <p><b>Fənn müəllimləri:</b> ... </p> */}
          <p>
            <b>Şagirdlər ({cls.students?.length || 0}):</b>
            <ul style={{marginLeft: "15px"}}>
              {(cls.students || []).map(st => <li key={st._id}>{st.name}</li>)}
            </ul>
          </p>
        </div>
      ))}
    </div>
  );
};

export default ClassCards;