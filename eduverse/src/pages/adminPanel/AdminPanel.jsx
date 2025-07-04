import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import "./AdminPanel.css";
import AdminDashboardCards from "./AdminDashboardCards";
import CreateClassSection from "./CreateClassSection";
import BulkRoleAssignSection from "./BulkRoleAssignSection";
import DeleteClassSection from "./DeleteClassSection";
import ClassCards from "./ClassCards";
import ManageSubjectsSection from "./ManageSubjectsSection";

const AdminPanel = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/admin";

  return (
    <div className="panelContainer">
  
      <nav className="sidebar">
        <div className="profileBox">
          <FaUsers className="profileIcon" />
          <span className="profileName">
            {loading
              ? "Yüklənir..."
              : user
              ? `${user.name} `
              : "İstifadəçi yoxdur"}
          </span>
        </div>

     
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `menuItem ${isActive ? "active" : ""}`}
        >
          <FaTachometerAlt /> Dashboard
        </NavLink>

        {/* Kurslar */}
        <NavLink
          to="/admin/courses"
          className={({ isActive }) => `menuItem ${isActive ? "active" : ""}`}
        >
          <FaBookOpen /> Kurslar
        </NavLink>

        {/* Müəllim Dərsləri */}
        <NavLink
          to="/admin/teacher-page"
          className={({ isActive }) => `menuItem ${isActive ? "active" : ""}`}
        >
          <FaBookOpen /> Müəllim Dərsləri
        </NavLink>

        {/* Çıxış */}
        <button onClick={() => navigate("/")} className="exitBtn">
          <FaSignOutAlt /> Çıxış
        </button>
      </nav>

     
      <main className="content">
        <h1>Admin Paneli</h1>

        {isDashboard ? (
          <>
            <AdminDashboardCards />
            <CreateClassSection />
            <BulkRoleAssignSection />
            <DeleteClassSection />
            <ClassCards />
            <ManageSubjectsSection />
            
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
