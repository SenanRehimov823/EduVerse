import React, { useEffect, useState } from "react";
import styles from "./AdminCoursesPanel.module.css";  

const AdminCoursesPanel = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchCourses = async () => {
    const res = await fetch("http://localhost:5000/api/course");
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("imageUrl", form.imageUrl);
    if (imageFile) formData.append("image", imageFile);

    const endpoint = editingId
      ? `http://localhost:5000/api/course/${editingId}`
      : "http://localhost:5000/api/course/create";

    const res = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(editingId ? "✅ Kurs yeniləndi" : "✅ Kurs əlavə olundu");
      setForm({ title: "", price: "", description: "", imageUrl: "" });
      setImageFile(null);
      setEditingId(null);
      fetchCourses();
    } else {
      setMessage("❌ Xəta: " + data.error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Kursu silmək istədiyinizə əminsiniz?")) return;
    const res = await fetch(`http://localhost:5000/api/course/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessage("✅ Kurs silindi");
      fetchCourses();
    } else {
      setMessage("❌ Silinmədi");
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      price: course.price,
      description: course.description,
      imageUrl: course.imageUrl,
    });
    setImageFile(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.panelWrapper}>
      <h3>{editingId ? "✏️ Kurs Redaktə et" : "🎓 Yeni Kurs Əlavə Et"}</h3>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Ad" className={styles.input} required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Qiymət (USD)" className={styles.input} type="number" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Təsvir" className={styles.textarea} />
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="URL şəkil (opsional)" className={styles.input} />
        <input type="file" onChange={handleFileChange} className={styles.input} accept="image/*" />
        <button type="submit" className={styles.submitButton}>
          {editingId ? "Yenilə" : "Əlavə et"}
        </button>
      </form>

      <hr />
      <h4>📋 Mövcud Kurslar</h4>
      <div className={styles.courseGrid}>
        {courses.map((course) => (
          <div className={styles.courseCard} key={course._id}>
            <img
              src={`http://localhost:5000/uploads/${course.imageFile}`}
              alt={course.title}
              className={styles.courseImage}
            />
            <div className={styles.courseContent}>
              <h5>{course.title}</h5>
              <p>{course.description}</p>
              <p><strong>{course.price} USD</strong></p>
              <div className={styles.buttonGroup}>
                <button className={styles.deleteButton} onClick={() => handleDelete(course._id)}>Sil</button>
                <button className={styles.editButton} onClick={() => handleEdit(course)}>Yenilə</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCoursesPanel;
