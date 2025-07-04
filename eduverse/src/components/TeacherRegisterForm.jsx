import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./TeacherRegisterForm.module.css";

const TeacherRegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    subjectName: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register/teacher", form, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        subjectName: "",
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Müəllim Qeydiyyatı</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Ad"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Şifrə"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Təkrar şifrə"
          value={form.confirmPassword}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="subjectName"
          placeholder="Fənn (məs: Riyaziyyat)"
          value={form.subjectName}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Qeydiyyatdan keç
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default TeacherRegisterForm;
