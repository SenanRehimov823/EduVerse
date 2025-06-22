import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const role = res.data.user.role;

      // Pending istifadəçi yalnız ana səhifəyə yönləndirilir
      if (role === "pending") {
        navigate("/");
      } else if (role === "student") {
        navigate("/student");
      } else if (role === "teacher") {
        navigate("/teacher");
      } else if (role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <div className="login-page">
      <h2>Giriş</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email daxil edin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifrə daxil edin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Daxil ol</button>
      </form>
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
