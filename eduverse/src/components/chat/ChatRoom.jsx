import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../../socket";
import styles from "./ChatRoom.module.css";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";

const ChatRoom = ({ lessonId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/chat/lesson/${lessonId}`, {
          withCredentials: true,
        });
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Mesajlar yüklənə bilmədi:", error);
      }
    };
    fetchMessages();
  }, [lessonId]);

  useEffect(() => {
    socket.emit("joinLessonRoom", lessonId);
    socket.on("newLessonMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off("newLessonMessage");
      socket.emit("leaveLessonRoom", lessonId);
    };
  }, [lessonId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/chat/lesson/send`,
        { lessonId, message: newMessage },
        { withCredentials: true }
      );
      setNewMessage("");
      socket.emit("sendLessonMessage", {
        lessonId,
        message: res.data.chatMessage,
      });
    } catch (error) {
      console.error("Göndərmə xətası:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/chat/lesson/message/${id}`, {
        withCredentials: true,
      });
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Silinmə xətası:", error);
    }
  };

  const handleEdit = async () => {
    if (!editedText.trim()) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/chat/lesson/message/${editingMessageId}`,
        { message: editedText },
        { withCredentials: true }
      );
      setMessages((prev) =>
        prev.map((m) => (m._id === editingMessageId ? res.data.chatMessage : m))
      );
      setEditingMessageId(null);
      setEditedText("");
    } catch (error) {
      console.error("Redaktə xətası:", error);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className={`${styles.chatWrapper} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.chatHeader}>
        Sinif Chati
        <button className={styles.toggleBtn} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className={styles.chatBody}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`${styles.messageRow} ${
              msg.sender?._id === currentUser._id ? styles.sent : styles.received
            }`}
          >
            <div className={styles.messageBubble}>
              <strong>{msg.sender?.name || "Anonim"}:</strong>{" "}
              {editingMessageId === msg._id ? (
                <>
                  <input
                    className={styles.editInput}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                  />
                  <div className={styles.actions}>
                    <FaEdit onClick={handleEdit} />
                    <FaTrash onClick={() => setEditingMessageId(null)} />
                  </div>
                </>
              ) : (
                <>
                  {msg.message}
                  {msg.sender?._id === currentUser._id && (
                    <div className={styles.actions}>
                      <FaEdit
                        onClick={() => {
                          setEditingMessageId(msg._id);
                          setEditedText(msg.message);
                        }}
                      />
                      <FaTrash onClick={() => handleDelete(msg._id)} />
                    </div>
                  )}
                </>
              )}
              <div className={styles.messageMeta}>{formatTime(msg.createdAt)}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInput}>
        <input
          value={editingMessageId ? editedText : newMessage}
          onChange={(e) =>
            editingMessageId ? setEditedText(e.target.value) : setNewMessage(e.target.value)
          }
          placeholder="Mesajınızı yazın..."
          onKeyDown={(e) => e.key === "Enter" && (editingMessageId ? handleEdit() : handleSend())}
        />
        <button onClick={editingMessageId ? handleEdit : handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
