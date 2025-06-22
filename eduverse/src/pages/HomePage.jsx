import { Link } from "react-router";

const HomePage = () => {
  return (
    <div>
      <h1>EduVerse-ə xoş gəlmisiniz</h1>
      <Link to="/register-student">Şagird Qeydiyyatı</Link> |{" "}
      <Link to="/register-teacher">Müəllim Qeydiyyatı</Link> |{" "}
      <Link to="/login">Giriş</Link>
    </div>
  );
};

export default HomePage;