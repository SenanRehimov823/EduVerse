import React from "react";
import styles from "./CourseCard.module.css"; // CSS Module istifadə edilir

const CourseCard = ({ course }) => {
  if (!course) return null;

  const handleBuy = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId: course._id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Ödəniş başlatmaq mümkün olmadı");
      }
    } catch (err) {
      console.error("Buy xətası:", err);
    }
  };

  const imageSrc = course.imageFile
    ? `http://localhost:5000/uploads/${course.imageFile}`
    : course.imageUrl || "/default-course.jpg";

  return (
    <div className={styles.courseCard}>
      <img src={imageSrc} alt={course.title} className={styles.courseImage} />
      <div className={styles.courseBody}>
        <h4 className={styles.courseTitle}>{course.title}</h4>
        <p className={styles.courseDesc}>✅ {course.description}</p>
        <p className={styles.coursePrice}>{course.price} USD</p>
        <button onClick={handleBuy} className={styles.buyBtn}>Satın Al</button>
      </div>
    </div>
  );
};

export default CourseCard;
