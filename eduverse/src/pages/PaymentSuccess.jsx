
import React from "react";
import { Link } from "react-router";

const PaymentSuccess = () => {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>✅ Ödəniş uğurla tamamlandı!</h1>
      <p>Artıq kursa giriş əldə etmisiniz.</p>
      <Link to="/" style={{ color: "#2563eb", textDecoration: "underline" }}>
        Əsas səhifəyə qayıt
      </Link>
    </div>
  );
};

export default PaymentSuccess;
