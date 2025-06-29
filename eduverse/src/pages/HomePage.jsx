import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import CourseCard from "./CourseCard";

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/course");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Kurslar yüklənə bilmədi:", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>EduVerse-ə xoş gəlmisiniz</h1>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/register-student">Şagird Qeydiyyatı</Link> | {" "}
        <Link to="/register-teacher">Müəllim Qeydiyyatı</Link> | {" "}
        <Link to="/login">Giriş</Link>
      </div>
      <h2>🎓 Kurslar</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
