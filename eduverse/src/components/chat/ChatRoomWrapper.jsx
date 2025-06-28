import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ChatRoom from "./ChatRoom";
import axios from "axios";

const ChatRoomWrapper = () => {
  const location = useLocation();
  const { lessonId } = location.state || {};
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setCurrentUser(res.data.user); 
      } catch (error) {
        console.error("İstifadəçi məlumatı alınmadı:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  if (!lessonId) {
    return <div className="alert alert-danger">Chat üçün məlumat tapılmadı.</div>;
  }

  if (!currentUser) {
    return <div className="alert alert-info">İstifadəçi yüklənir...</div>;
  }

  return <ChatRoom lessonId={lessonId} currentUser={currentUser} />;
};

export default ChatRoomWrapper;
