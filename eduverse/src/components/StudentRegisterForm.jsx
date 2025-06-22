import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

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
    <div className="register-container">
      <h2>Şagird Qeydiyyatı</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Ad" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Şifrə" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Şifrəni təkrar daxil edin" value={formData.confirmPassword} onChange={handleChange} required />
        <input type="text" name="grade" placeholder="Sinif (məs. 8)" value={formData.grade} onChange={handleChange} required />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Qeydiyyat</button>
      </form>
    </div>
  );
};

export default StudentRegisterForm;
