import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import MergedChatRoom from "./MergedChatRoom";

const MergedChatWrapper = () => {
  const location = useLocation();
  const { subject, className } = location.state || {};
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error("İstifadəçi tapılmadı:", err);
      }
    };
    fetchUser();
  }, []);

  if (!subject || !className) {
    return <div className="alert alert-danger">Fənn və sinif məlumatı tapılmadı.</div>;
  }

  if (!currentUser) {
    return <div className="alert alert-info">İstifadəçi yüklənir...</div>;
  }

  return <MergedChatRoom subject={subject} className={className} currentUser={currentUser} />;
};

export default MergedChatWrapper;
