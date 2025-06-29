import React from "react";

const CourseCard = ({ course }) => {
  if (!course) return null;

  const handleBuy = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId: course._id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Ödəniş başlatmaq mümkün olmadı");
      }
    } catch (err) {
      console.error("Buy xətası:", err);
    }
  };

  const imageSrc = course.imageFile
    ? `http://localhost:5000/uploads/${course.imageFile}`
    : course.imageUrl || "/default-course.jpg"; // fallback varsa

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <img
        src={imageSrc}
        alt={course.title || "Kurs şəkli"}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <div style={{ padding: "15px" }}>
        <h4>{course.title}</h4>
        <p>{course.description}</p>
        <p><strong>{course.price} USD</strong></p>
        <button
          onClick={handleBuy}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          💳 Satın Al
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
