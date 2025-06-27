import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../../socket";
import { Button, Form, InputGroup } from "react-bootstrap";

const ChatRoom = ({ lessonId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/chat/lesson/${lessonId}`, {
          withCredentials: true,
        });
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Mesajları yükləmək olmadı:", error);
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

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/chat/lesson/message/${messageId}`, {
        withCredentials: true,
      });
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container p-3 border rounded shadow">
      <h5 className="mb-3">💬 Dərs Çatı</h5>
      <div className="chat-box border rounded p-3 mb-3" style={{ height: "400px", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div key={msg._id} className="mb-3">
            <div>
              <strong>{msg.sender?.name || "Anonim"}:</strong>{" "}
              {editingMessageId === msg._id ? (
                <InputGroup className="mt-1">
                  <Form.Control
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    size="sm"
                    onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                  />
                  <Button variant="success" size="sm" onClick={handleEdit}>
                    ✅
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditingMessageId(null)}>
                    ❌
                  </Button>
                </InputGroup>
              ) : (
                <>
                  {msg.message}
                  {msg.sender?._id === currentUser._id && (
                    <>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger ms-2 p-0"
                        onClick={() => handleDelete(msg._id)}
                      >
                        Sil
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-primary ms-1 p-0"
                        onClick={() => {
                          setEditingMessageId(msg._id);
                          setEditedText(msg.message);
                        }}
                      >
                        Redaktə
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
            <small className="text-muted">{formatTime(msg.createdAt)}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <InputGroup>
        <Form.Control
          value={editingMessageId ? editedText : newMessage}
          onChange={(e) =>
            editingMessageId ? setEditedText(e.target.value) : setNewMessage(e.target.value)
          }
          placeholder="Mesajınızı yazın..."
          onKeyDown={(e) =>
            e.key === "Enter" &&
            (editingMessageId ? handleEdit() : handleSend())
          }
        />
        <Button variant="primary" onClick={editingMessageId ? handleEdit : handleSend}>
          {editingMessageId ? "Redaktəni Təsdiqlə" : "Göndər"}
        </Button>
      </InputGroup>
    </div>
  );
};

export default ChatRoom;
