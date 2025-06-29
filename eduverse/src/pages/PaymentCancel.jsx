import React from "react";
import { Link } from "react-router";

const PaymentCancel = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ color: "red" }}>❌ Ödəniş ləğv edildi</h1>
      <p>Ödənişi tamamlamadınız və ya problem baş verdi.</p>
      <Link to="/" style={{ color: "#2563eb" }}>Ana səhifəyə qayıt</Link>
    </div>
  );
};

export default PaymentCancel;
