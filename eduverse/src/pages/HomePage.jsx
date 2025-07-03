import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import CourseCard from "./CourseCard";
import EduVerseFeatures from "./EduVerseFeatures";
import FuturePlanets from "./FuturePlanets";
import styles from "./HomePage.module.css"; // yeni css faylı
import HeroSection from "./HeroSection";


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
    <div>
      <HeroSection/>
      <EduVerseFeatures />
      <FuturePlanets />

      <div className={styles.wrapper}>
        <h2 className={styles.subheading}>🎓 Kurslar</h2>
        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;
