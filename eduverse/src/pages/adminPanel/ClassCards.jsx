import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ClassCards.module.css"; 

const ClassCards = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/class/all-classes", {
        withCredentials: true,
      });
      setClasses(res.data.classes || []);
    } catch (err) {
      setError("Sinifləri yükləmək mümkün olmadı");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (cls) => {
    if (!window.confirm(`${cls.grade}${cls.section} sinifini silmək istədiyinizə əminsiniz?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/class/${cls.grade}${cls.section}`, {
        withCredentials: true,
      });
      setClasses((prev) =>
        prev.filter((c) => !(c.grade === cls.grade && c.section === cls.section))
      );
    } catch (err) {
      alert("Sinifi silmək mümkün olmadı");
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.classContainer}>
      {classes.map((cls) => (
        <div className={styles.card} key={cls._id}>
          <div className={styles.cardHeader}>
            <h3>{cls.grade}{cls.section} sinfi</h3>
            <button
              onClick={() => handleDelete(cls)}
              className={styles.deleteBtn}
              title="Sil"
            >
              ✖
            </button>
          </div>
          <p><strong>Rəhbər müəllim:</strong> {cls.teacher?.name || "Təyin olunmayıb"}</p>
          <p>
            <strong>Şagirdlər ({cls.students?.length || 0}):</strong>
            <ul>
              {(cls.students || []).map((st) => (
                <li key={st._id}>{st.name}</li>
              ))}
            </ul>
          </p>
        </div>
      ))}
    </div>
  );
};

export default ClassCards;
