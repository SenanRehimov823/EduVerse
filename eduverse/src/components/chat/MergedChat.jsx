import React, { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import axios from "axios";
import styles from "./MergedChat.module.css";
import { FaEdit, FaTrash, FaMoon, FaSun } from "react-icons/fa";

const MergedChat = ({ subject, className, currentUser }) => {
  const roomKey = `${subject}_${className}`;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("mergedChatDark") === "true"
  );
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/chat/merged?subject=${subject}&className=${className}`,
          { withCredentials: true }
        );
        setMessages(res.data.messages || []);
      } catch {}
    };
    fetchMessages();
  }, [subject, className]);

  useEffect(() => {
    socket.emit("joinMergedRoom", roomKey);

    const handleNew = (msg) => setMessages((prev) => [...prev, msg]);
    const handleEdit = (updated) =>
      setMessages((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
    const handleDelete = ({ id }) =>
      setMessages((prev) => prev.filter((m) => m._id !== id));

    socket.on("newMergedMessage", handleNew);
    socket.on("editedMergedMessage", handleEdit);
    socket.on("deletedMergedMessage", handleDelete);

    return () => {
      socket.off("newMergedMessage", handleNew);
      socket.off("editedMergedMessage", handleEdit);
      socket.off("deletedMergedMessage", handleDelete);
      socket.emit("leaveMergedRoom", roomKey);
    };
  }, [roomKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      if (editId) {
        const res = await axios.put(
          `http://localhost:5000/chat/merged/message/${editId}`,
          { message: newMessage },
          { withCredentials: true }
        );
        socket.emit("editMergedMessage", { roomKey, message: res.data.message });
        setEditId(null);
      } else {
        const res = await axios.post(
          `http://localhost:5000/chat/merged/send`,
          { subject, className, message: newMessage },
          { withCredentials: true }
        );
        socket.emit("sendMergedMessage", { roomKey, message: res.data.message });
      }
      setNewMessage("");
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/chat/merged/message/${id}`, {
        withCredentials: true,
      });
      socket.emit("deleteMergedMessage", { roomKey, messageId: id });
    } catch {}
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTheme = () => {
    setDarkMode((prev) => {
      localStorage.setItem("mergedChatDark", !prev);
      return !prev;
    });
  };

  return (
    <div
      className={`${styles.chatWrapper} ${darkMode ? styles.dark : styles.light}`}
    >
      <div className={styles.chatHeader}>
        <h5>🧑‍🏫 Chat ({subject}/{className})</h5>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className={styles.chatBox}>
        {messages.map((msg) => {
          const senderId = msg?.sender?._id?.toString();
          const myId = currentUser?._id?.toString();
          const isMine = senderId && myId && senderId === myId;

          return (
            <div
              key={msg._id}
              className={`${styles.chatMessage} ${
                isMine ? styles.mine : styles.theirs
              }`}
            >
              <div className={styles.senderName}>{msg?.sender?.name}</div>
              <div className={styles.messageText}>
                {msg.message}
                {msg.edited && <span className={styles.editedLabel}>(redaktə edilib)</span>}
              </div>
              <div className={styles.bottomBar}>
                <span className={styles.time}>{formatTime(msg.createdAt)}</span>
                {isMine && (
                  <span className={styles.actions}>
                    <FaEdit
                      className={styles.iconBtn}
                      onClick={() => {
                        setEditId(msg._id);
                        setNewMessage(msg.message.replace(" (redaktə edilib)", ""));
                      }}
                    />
                    <FaTrash
                      className={styles.iconBtn}
                      onClick={() => handleDelete(msg._id)}
                    />
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="Mesajınızı yazın..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          {editId ? "Yenilə" : "Göndər"}
        </button>
      </div>
    </div>
  );
};

export default MergedChat;
