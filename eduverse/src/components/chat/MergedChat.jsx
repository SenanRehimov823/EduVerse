import React, { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import axios from "axios";
import { Button, Form, InputGroup } from "react-bootstrap";

const MergedChat = ({ subject, className, currentUser }) => {
  const roomKey = `${subject}_${className}`;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/chat/merged?subject=${subject}&className=${className}`,
          { withCredentials: true }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Mesajlar yüklənmədi:", err);
      }
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
    } catch (err) {
      console.error("Mesaj göndərilə bilmədi:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/chat/merged/message/${id}`, {
        withCredentials: true,
      });
      socket.emit("deleteMergedMessage", { roomKey, messageId: id });
    } catch (err) {
      console.error("Silinmədi:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container p-3 border rounded shadow">
      <h5 className="mb-3">🧑‍🏫 Müştərək Chat ({subject} / {className})</h5>
      <div className="chat-box border rounded p-3 mb-3" style={{ height: "400px", overflowY: "auto" }}>
        {messages.map((msg) => {
          const senderId = msg?.sender?._id?.toString();
          const myId = currentUser?._id?.toString();
          const isMine = senderId && myId && senderId === myId;

          return (
            <div
              key={msg._id}
              className={`mb-3 p-2 rounded ${isMine ? "bg-primary text-white text-end ms-auto" : "bg-light text-start me-auto"}`}
              style={{ maxWidth: "70%" }}
            >
              <div>
                <strong>{msg?.sender?.name || "İstifadəçi"}</strong>
              </div>
              <div>
                {msg.message}
                {msg.edited && <span className="text-warning ms-2">(redaktə edilib)</span>}
              </div>
              <div className="d-flex justify-content-between">
                <small className="text-muted ms-1 mt-1">{formatTime(msg.createdAt)}</small>
                {isMine && (
                  <div className="d-flex gap-1 justify-content-end">
                    <button className="btn btn-sm btn-light" onClick={() => {
                      setEditId(msg._id);
                      setNewMessage(msg.message.replace(" (redaktə edilib)", ""));
                    }}>✏</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(msg._id)}>🗑</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <InputGroup>
        <Form.Control
          placeholder="Mesajınızı yazın..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="primary" onClick={handleSend}>
          {editId ? "Yenilə" : "Göndər"}
        </Button>
      </InputGroup>
    </div>
  );
};

export default MergedChat;
