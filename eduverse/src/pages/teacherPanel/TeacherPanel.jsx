import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FaBook,
  FaClipboardList,
  FaComments,
  FaPlusCircle,
  FaArrowLeft,
  FaUser,
} from "react-icons/fa";
import MergedChatPage from "../../pages/teacherPanel/MergedChatPage";
import CreateQuizPage from "../../pages/teacherPanel/CreateQuizPage";
import JournalPage from "../../pages/teacherPanel/JournalPage";
import QuizListPage from "../../pages/teacherPanel/QuizListPage";
import StudentProfile from "../../pages/studentPanel/StudentProfile"; // profil olaraq istifadə olunur
import { useAuth } from "../../context/AuthContext";
import styles from "./TeacherPanel.module.css";

const TeacherPanel = () => {
  const [active, setActive] = useState("journal");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (active) {
      case "journal":
        return <JournalPage />;
      case "createQuiz":
        return <CreateQuizPage />;
      case "quizList":
        return <QuizListPage />;
      case "chat":
        return <MergedChatPage />;
      case "profile":
        return <StudentProfile />; // hazır profil komponentindən istifadə
      default:
        return <JournalPage />;
    }
  };

  return (
    <div className={styles.panelContainer}>
      <nav className={styles.sidebar}>
        <div className={styles.profileBox}>
          <FaUser className={styles.profileIcon} />
          <span className={styles.profileName}>
            {loading ? "Yüklənir..." : user ? `${user.name}` : ""}
          </span>
        </div>

        <button
          onClick={() => setActive("journal")}
          className={`${styles.menuItem} ${active === "journal" ? styles.active : ""}`}
        >
          <FaBook /> Jurnal
        </button>

        <button
          onClick={() => setActive("createQuiz")}
          className={`${styles.menuItem} ${active === "createQuiz" ? styles.active : ""}`}
        >
          <FaPlusCircle /> Quiz Yarat
        </button>

        <button
          onClick={() => setActive("quizList")}
          className={`${styles.menuItem} ${active === "quizList" ? styles.active : ""}`}
        >
          <FaClipboardList /> Quiz Siyahısı
        </button>

        <button
          onClick={() => setActive("chat")}
          className={`${styles.menuItem} ${active === "chat" ? styles.active : ""}`}
        >
          <FaComments /> Chat
        </button>

        <button
          onClick={() => setActive("profile")}
          className={`${styles.menuItem} ${active === "profile" ? styles.active : ""}`}
        >
          <FaUser /> Şəxsi Məlumat
        </button>

        <button onClick={() => navigate("/")} className={styles.exitBtn}>
          <FaArrowLeft /> Ana səhifəyə qayıt
        </button>
      </nav>

      <main className={styles.content}>{renderContent()}</main>
    </div>
  );
};

export default TeacherPanel;
