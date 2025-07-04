import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import styles from "./StudentRegisterForm.module.css";

const StudentRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Şifrələr uyğun deyil");
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register/student", formData);
      navigate("/login"); 
    } catch (err) {
      setError(err.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.registerTitle}>Şagird Qeydiyyatı</h2>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <input
          type="text"
          name="name"
          placeholder="Ad"
          value={formData.name}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Şifrə"
          value={formData.password}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Şifrəni təkrar daxil edin"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="text"
          name="grade"
          placeholder="Sinif (məs. 8)"
          value={formData.grade}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button type="submit" className={styles.submitButton}>Qeydiyyat</button>
      </form>
    </div>
  );
};

export default StudentRegisterForm;
