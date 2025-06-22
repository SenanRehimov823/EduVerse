import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import StudentRegisterForm from "../components/StudentRegisterForm";
import TeacherRegisterForm from "../components/TeacherRegisterForm";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-student" element={<StudentRegisterForm />} />
        <Route path="/register-teacher" element={<TeacherRegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
