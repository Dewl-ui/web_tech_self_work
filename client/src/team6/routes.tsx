import { Navigate } from "react-router-dom";

import Home from "./Home";

// Teacher Pages
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { CourseList } from "./pages/teacher/CourseList";
import { CourseDetail } from "./pages/teacher/CourseDetail";
import { ExamsList } from "./pages/teacher/ExamsList";
import { CreateExam } from "./pages/teacher/CreateExam";
import { ExamDetail } from "./pages/teacher/ExamDetail";
import { EditExam } from "./pages/teacher/EditExam";
import { ExamVariants } from "./pages/teacher/ExamVariants";
import { CreateVariant } from "./pages/teacher/CreateVariant";
import { VariantDetail } from "./pages/teacher/VariantDetail";
import { AddQuestions } from "./pages/teacher/AddQuestions";
import { CreateMultipleChoice } from "./pages/teacher/CreateMultipleChoice";
import { CreateTrueFalse } from "./pages/teacher/CreateTrueFalse";
import { CreateShortAnswer } from "./pages/teacher/CreateShortAnswer";
import { ExamReport } from "./pages/teacher/ExamReport";
import { StudentResults } from "./pages/teacher/StudentResults";
import { StudentResultDetail } from "./pages/teacher/StudentResultDetail";
import { GradeExam } from "./pages/teacher/GradeExam";
import { ViewAnalytics } from "./pages/teacher/ViewAnalytics";

// Student Pages
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { AvailableExams } from "./pages/student/AvailableExams";
import { ExamInstructions } from "./pages/student/ExamInstructions";
import { ExamTaking } from "./pages/student/ExamTaking";
import { ReviewAnswers } from "./pages/student/ReviewAnswers";
import { ExamResult } from "./pages/student/ExamResult";
import { AnswerReview } from "./pages/student/AnswerReview";

// Shared Components
import { TeacherLayout } from "./components/layouts/TeacherLayout";
import { StudentLayout } from "./components/layouts/StudentLayout";
import Layout from "./Layout";

export const team6Routes = [
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "teacher",
    element: <TeacherLayout />,
    children: [
      { index: true, element: <TeacherDashboard /> },
      { path: "courses", element: <CourseList /> },
      { path: "courses/:courseId", element: <CourseDetail /> },
      { path: "courses/:courseId/exams", element: <ExamsList /> },
      { path: "courses/:courseId/exams/create", element: <CreateExam /> },
      { path: "exams/:examId", element: <ExamDetail /> },
      { path: "exams/:examId/edit", element: <EditExam /> },
      { path: "exams/:examId/variants", element: <ExamVariants /> },
      { path: "exams/:examId/variants/create", element: <CreateVariant /> },
      { path: "exams/:examId/variants/:variantId", element: <VariantDetail /> },
      { path: "exams/:examId/questions/add", element: <AddQuestions /> },
      {
        path: "exams/:examId/questions/multiple-choice",
        element: <CreateMultipleChoice />,
      },
      {
        path: "exams/:examId/questions/true-false",
        element: <CreateTrueFalse />,
      },
      {
        path: "exams/:examId/questions/short-answer",
        element: <CreateShortAnswer />,
      },
      { path: "exams/:examId/report", element: <ExamReport /> },
      { path: "exams/:examId/results", element: <StudentResults /> },
      {
        path: "exams/:examId/results/:studentId",
        element: <StudentResultDetail />,
      },
      {
        path: "exams/:examId/results/:studentId/grade",
        element: <GradeExam />,
      },
      { path: "analytics", element: <ViewAnalytics /> },
    ],
  },
  {
    path: "student",
    element: <StudentLayout />,
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: "exams", element: <AvailableExams /> },
      { path: "exams/:examId/instructions", element: <ExamInstructions /> },
      { path: "exams/:examId/take", element: <ExamTaking /> },
      { path: "exams/:examId/review-answers", element: <ReviewAnswers /> },
      { path: "exams/:examId/result", element: <ExamResult /> },
      { path: "exams/:examId/review", element: <AnswerReview /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
