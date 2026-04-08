import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import DashboardPage from "./DashboardPage";
import CoursesPage from "./CoursesPage";
import CourseDetailPage from "./CourseDetailPage";
import ExamsPage from "./ExamsPage";
import ExamDetailPage from "./ExamDetailPage";

const Index = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />
        <Route path="courses/:courseId/exams" element={<ExamsPage />} />
        <Route path="exams/:examId" element={<ExamDetailPage />} />
      </Route>
    </Routes>
  );
};

export default Index;