import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import MergedChatRoom from "./MergedChatRoom";

const MergedChatWrapperForStudent = () => {
  const location = useLocation();
  const { lessonId } = location.state || {};
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. İstifadəçi məlumatı
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setCurrentUser(userRes.data.user);

        // 2. Lesson məlumatı (subject, className)
        if (lessonId) {
          const lessonRes = await axios.get(`http://localhost:5000/api/lesson/${lessonId}`, {
            withCredentials: true,
          });
          setSubject(lessonRes.data.lesson.subject);
          setClassName(lessonRes.data.lesson.className);
        }
      } catch (err) {
        console.error("Məlumatlar yüklənmədi:", err);
      }
    };

    fetchData();
  }, [lessonId]);

  if (!lessonId) {
    return <div className="alert alert-danger">lessonId tapılmadı.</div>;
  }

  if (!subject || !className || !currentUser) {
    return <div className="alert alert-info">Yüklənir...</div>;
  }

  return (
    <MergedChatRoom
      subject={subject}
      className={className}
      currentUser={currentUser}
    />
  );
};

export default MergedChatWrapperForStudent;
