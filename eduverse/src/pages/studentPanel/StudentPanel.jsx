import React, { useState } from "react";
import {
  FaBook,
  FaUser,
  FaComments,
  FaClipboardList,
  FaArrowLeft,
} from "react-icons/fa";
import MySubjects from "./MySubjects";
import StudentProfile from "./StudentProfile";
import StudentDashboard from "./StudentDashboard";
import StudentActiveQuizzes from "./StudentActiveQuizzes";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext"; 
import styles from "./StudentPanel.module.css";

const StudentPanel = () => {
  const [active, setActive] = useState("subjects");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (active) {
      case "subjects":
        return <MySubjects />;
      case "profile":
        return <StudentProfile />;
      case "chat":
        return <StudentDashboard />;
      case "quizzes":
        return <StudentActiveQuizzes />;
      default:
        return <MySubjects />;
    }
  };

  return (
    <div className={styles.panelContainer}>
      <nav className={styles.sidebar}>
        <div className={styles.profileBox}>
          <FaUser className={styles.profileIcon} />
          <span className={styles.profileName}>
            {loading
              ? "Yüklənir..."
              : user
              ? `${user.name}`
              : "İstifadəçi yoxdur"}
          </span>
        </div>

        <button
          onClick={() => setActive("subjects")}
          className={`${styles.menuItem} ${active === "subjects" ? styles.active : ""}`}
        >
          <FaBook /> Fənlər
        </button>

        <button
          onClick={() => setActive("profile")}
          className={`${styles.menuItem} ${active === "profile" ? styles.active : ""}`}
        >
          <FaUser /> Şəxsi məlumat
        </button>

        <button
          onClick={() => setActive("quizzes")}
          className={`${styles.menuItem} ${active === "quizzes" ? styles.active : ""}`}
        >
          <FaClipboardList /> Quizlərim
        </button>

        <button
          onClick={() => setActive("chat")}
          className={`${styles.menuItem} ${active === "chat" ? styles.active : ""}`}
        >
          <FaComments /> Sinif Çatı
        </button>

        <button onClick={() => navigate("/")} className={styles.exitBtn}>
          <FaArrowLeft /> Ana səhifəyə qayıt
        </button>
      </nav>

      <main className={styles.content}>{renderContent()}</main>
    </div>
  );
};

export default StudentPanel;
