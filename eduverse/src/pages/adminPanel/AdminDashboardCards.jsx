import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboardCards = ({ fetchTrigger }) => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalUsers: 0,
  });

  // Stats-ı yenidən fetch etmək üçün əlavə olaraq fetchTrigger dependency-si əlavə olundu.
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [classRes, userRes] = await Promise.all([
          axios.get("http://localhost:5000/api/class/all-classes", { withCredentials: true }),
          axios.get("http://localhost:5000/api/admin/all-users", { withCredentials: true }),
        ]);
        const totalClasses = Array.isArray(classRes.data.classes) ? classRes.data.classes.length : 0;
        const users = userRes.data.users || [];
        const totalStudents = users.filter((u) => u.role === "student").length;
        const totalTeachers = users.filter((u) => u.role === "teacher").length;
        const totalUsers = users.length;

        setStats({ totalClasses, totalStudents, totalTeachers, totalUsers });
      } catch (error) {
        setStats({
          totalClasses: 0,
          totalStudents: 0,
          totalTeachers: 0,
          totalUsers: 0,
        });
        console.error("Xəta baş verdi", error);
      }
    };

    fetchStats();
  }, [fetchTrigger]); 

  return (
    <div className="dashboard-cards" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <div className="card">🔢 Ümumi istifadəçi sayı: <strong>{stats.totalUsers}</strong></div>
      <div className="card">🎓 Şagird sayı: <strong>{stats.totalStudents}</strong></div>
      <div className="card">👨‍🏫 Müəllim sayı: <strong>{stats.totalTeachers}</strong></div>
      <div className="card">🏫 Sinif sayı: <strong>{stats.totalClasses}</strong></div>
    </div>
  );
};

export default AdminDashboardCards;