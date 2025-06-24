import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import StudentRegisterForm from "../components/StudentRegisterForm";
import TeacherRegisterForm from "../components/TeacherRegisterForm";
import AdminPanel from "../pages/adminPanel/AdminPanel";
import ProtectedRoute from "./ProtectedRoute";
import TeacherPage from "../pages/teacherPanel/TeacherPage";
import JournalPage from "../pages/teacherPanel/JournalPage";

const Router = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-student" element={<StudentRegisterForm />} />
        <Route path="/register-teacher" element={<TeacherRegisterForm />} />
      <Route path="/admin" element={<AdminPanel />} />
 <Route path="/teacher-page" element={<TeacherPage/>} />
 <Route path="/teacher/journal" element={<JournalPage/>} />
        {/* Admin route - sadəcə adminlərə */}
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
