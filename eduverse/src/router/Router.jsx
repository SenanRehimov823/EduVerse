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
import CreateQuizPage from "../pages/teacherPanel/CreateQuizPage";
import QuizListPage from "../pages/teacherPanel/QuizListPage";
import QuizResultDetails from "../components/quiz/QuizResultDetails";
import StudentProfile from "../pages/studentPanel/StudentProfile";
import MySubjects from "../pages/studentPanel/MySubjects";
import MyJournal from "../pages/studentPanel/MyJournal";
import ChatRoom from "../components/chat/ChatRoom";
import ChatRoomWrapper from "../components/chat/ChatRoomWrapper";
import TeacherChatWrapper from "../components/chat/TeacherChatWrapper";
import MergedChatWrapper from "../components/chat/MergedChatWrapper";
import MergedChatRoom from "../components/chat/MergedChatRoom";
import MergedChatPage from "../pages/teacherPanel/MergedChatPage";
import AdminCoursesPanel from "../pages/adminPanel/AdminCoursesPanel";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import StudentDashboard from "../pages/studentPanel/StudentDashboard";
import StudentActiveQuizzes from "../pages/studentPanel/StudentActiveQuizzes";
import TakeQuiz from "../pages/studentPanel/TakeQuiz";
import StudentQuizResult from "../pages/studentPanel/StudentQuizResult";
import Layout from "../components/layout/Layout";
import StudentPanel from "../pages/studentPanel/StudentPanel";
import TeacherPanel from "../pages/teacherPanel/TeacherPanel";


const Router = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-student" element={<StudentRegisterForm />} />
          <Route path="/register-teacher" element={<TeacherRegisterForm />} />
          {/* <Route path="/admin" element={<AdminPanel />} /> */}
          {/* <Route path="/teacher-page" element={<TeacherPage />} /> */}
          <Route path="/teacher/journal" element={<JournalPage />} />
          <Route path="/teacher/quiz/create" element={<CreateQuizPage />} />
          <Route path="/teacher/quiz/list" element={<QuizListPage />} />
          <Route path="/teacher/quiz/:quizId/results" element={<QuizResultDetails />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/subjects" element={<MySubjects />} />

          <Route path="/merged-chat" element={<MergedChatWrapper />} />
          <Route path="/merged-chat-room" element={<MergedChatRoom />} />

          <Route path="/student/my-journals" element={<MyJournal />} />

          <Route path="/student/chat-room" element={<ChatRoomWrapper />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/panel" element={<StudentPanel />} />
<Route path="/teacher/panel" element={<TeacherPanel />} />
          <Route path="/teacher-chat" element={<TeacherChatWrapper />} />
          <Route path="/teacher/chat" element={<MergedChatPage />} />

          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/student/quiz-active" element={<StudentActiveQuizzes />} />
          <Route path="/student/quiz/:quizId" element={<TakeQuiz />} />
          <Route path="/student/quiz-result/:quizId" element={<StudentQuizResult />} />
          <Route path="/admin" element={<AdminPanel />}>
            <Route index element={<h2>Admin Dashboard</h2>} />
            <Route path="courses" element={<AdminCoursesPanel />} />
             <Route path="teacher-page" element={<TeacherPage />} />
          </Route>
        </Route>

       
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
