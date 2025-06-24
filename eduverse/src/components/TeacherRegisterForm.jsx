import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

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
    <div>
      <h2>Müəllim Qeydiyyatı</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Ad" value={form.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Şifrə" value={form.password} onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Təkrar şifrə" value={form.confirmPassword} onChange={handleChange} />
        <input type="text" name="subjectName" placeholder="Fənn (məs: Riyaziyyat)" value={form.subjectName} onChange={handleChange} />
        <button type="submit">Qeydiyyatdan keç</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default TeacherRegisterForm;
