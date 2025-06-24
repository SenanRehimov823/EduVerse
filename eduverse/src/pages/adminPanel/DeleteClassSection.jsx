import React, { useState, useEffect } from "react";
import axios from "axios";

const DeleteClassSection = ({ fetchClasses, classes: externalClasses }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [message, setMessage] = useState("");

  // Əgər parentdən classes prop-u gəlibsə, onu istinad kimi saxla!
  useEffect(() => {
    if (externalClasses && Array.isArray(externalClasses)) {
      setClasses(externalClasses);
    }
  }, [externalClasses]);

  // Əgər parentdən fetchClasses prop-u gəlməyibsə, local fetch et
  useEffect(() => {
    if (!externalClasses) {
      const fetchOwnClasses = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/class/all-classes", {
            withCredentials: true,
          });
          setClasses(res.data.classes);
        } catch (error) {
          console.error("Sinifləri çəkmək mümkün olmadı", error);
        }
      };
      fetchOwnClasses();
    }
  }, [externalClasses]);

  const handleDelete = async () => {
    if (!selectedClass) return;
    try {
      const { grade, section = "", sector = "" } = selectedClass;
      let url = `http://localhost:5000/api/class/${grade}`;
      if (section) url += `/${section}`;
      if (sector) url += `/${sector}`;
      await axios.delete(url, { withCredentials: true });
      setMessage("Sinif uğurla silindi");
      setSelectedClass(null);

      // Əgər parentdən fetchClasses gəlibsə, onu çağır, yoxdursa local yenilə
      if (typeof fetchClasses === "function") {
        fetchClasses();
      } else {
        setClasses(classes.filter(
          cls =>
            !(
              cls.grade === grade &&
              (cls.section || "") === (section || "") &&
              (cls.sector || "") === (sector || "")
            )
        ));
      }
    } catch (error) {
      setMessage("Xəta baş verdi: " + (error.response?.data?.message || ""));
    }
  };

  return (
    <div className="delete-class-section">
      <h3>❌ Sinifi Sil</h3>
      <select
        value={selectedClass ? JSON.stringify(selectedClass) : ""}
        onChange={(e) =>
          setSelectedClass(
            e.target.value ? JSON.parse(e.target.value) : null
          )
        }
      >
        <option value="">Sinif seçin</option>
        {classes.map((cls) => (
          <option
            key={cls._id}
            value={JSON.stringify({
              grade: cls.grade,
              section: cls.section || "",
              sector: cls.sector || "",
            })}
          >
            {cls.grade}{cls.section}{cls.sector ? ` - ${cls.sector}` : ""} - {cls.teacher?.name || "-"}
          </option>
        ))}
      </select>
      <button onClick={handleDelete} disabled={!selectedClass}>
        Sil
      </button>
      {message && <p style={{ color: "red", marginTop: 10 }}>{message}</p>}
    </div>
  );
};

export default DeleteClassSection;