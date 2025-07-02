import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import MergedChat from "./MergedChat";
import styles from "./MergedChatRoom.module.css";

const MergedChatRoom = () => {
  const { search, state } = useLocation();
  const params = new URLSearchParams(search);
  const [subject, setSubject] = useState(null);
  const [className, setClassName] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserAndLesson = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setCurrentUser(userRes.data.user);

        const subjectParam = params.get("subject");
        const classParam = params.get("className");

        if (subjectParam && classParam) {
          setSubject(subjectParam);
          setClassName(classParam);
        } else if (state?.lessonId) {
          const lessonRes = await axios.get(
            `http://localhost:5000/api/lesson/${state.lessonId}`,
            { withCredentials: true }
          );
          setSubject(lessonRes.data.subject);
          setClassName(lessonRes.data.className);
        }
      } catch {}
    };

    fetchUserAndLesson();
  }, [search, state]);

  if (!subject || !className) {
    return <div className={styles.alertDanger}>Fənn və sinif məlumatı tapılmadı.</div>;
  }

  if (!currentUser) {
    return <div className={styles.alertInfo}>İstifadəçi yüklənir...</div>;
  }

  return (
    <MergedChat
      subject={subject}
      className={className}
      currentUser={currentUser}
    />
  );
};

export default MergedChatRoom;
