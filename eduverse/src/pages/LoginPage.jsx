import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext"; 
import "./LoginPage.css";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      setUser(res.data.user); 

      const role = res.data.user.role;

      if (role === "pending") {
        navigate("/");
      } else if (role === "student") {
        navigate("/");
      } else if (role === "teacher") {
        navigate("/");
      } else if (role === "admin") {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src="../../public/login.jpg"
          alt="Login Illustration"
          className="illustration-img"
        />
      </div>
      <div className="login-right">
        <img
          src="../../public/logo.jpg"
          alt="EduVerse Logo"
          className="logo-img"
        />
        <h2 className="login-title">Giriş</h2>

        <form onSubmit={handleLogin} className="login-form">
          <label>Email adresini və ya istifadəçi adını qeyd et</label>
          <input
            type="email"
            placeholder="E-mail və ya istifadəçi adı"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Şifrə</label>
          <input
            type="password"
            placeholder="Şifrə"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="remember-section">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Xatırla</label>
          </div>

          <button type="submit" className="login-button">Daxil Ol</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="alt-login">
          <hr />
         
          <hr />
        </div>

        <div className="login-options">
        
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
