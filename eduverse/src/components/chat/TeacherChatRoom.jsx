import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

const TeacherChatRoom = ({ subject, className, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const bottomRef = useRef(null);

  const roomKey = `${subject}_${className}`;

  useEffect(() => {
    socket.emit("joinTeacherRoom", roomKey);
    return () => {
      socket.emit("leaveTeacherRoom", roomKey);
    };
  }, [roomKey]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/chat/messages/combined", {
          params: { subject, className },
          withCredentials: true,
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("📥 Mesajlar alınmadı:", err);
      }
    };

    fetchMessages();
  }, [subject, className]);

  useEffect(() => {
    const handleNewMessage = (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    };

    socket.on("newTeacherMessage", handleNewMessage);
    return () => {
      socket.off("newTeacherMessage", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/chat/send/teacher",
        { subject, className, message: messageText },
        { withCredentials: true }
      );

      setMessageText("");
      socket.emit("sendTeacherMessage", { roomKey, message: res.data.chatMessage });
    } catch (err) {
      console.error("📤 Mesaj göndərilə bilmədi:", err);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        {subject} — {className} üçün Chat
      </div>
      <div className="card-body" style={{ height: "400px", overflowY: "auto" }}>
        {Array.isArray(messages) && messages.map((msg) => (
          <div key={msg._id || Math.random()} className="mb-2">
            <strong>{msg.sender?.name || "Naməlum"}:</strong> {msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="card-footer d-flex">
        <input
          className="form-control me-2"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Mesaj yaz..."
        />
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={!messageText.trim()}
        >
          Göndər
        </button>
      </div>
    </div>
  );
};

export default TeacherChatRoom;
