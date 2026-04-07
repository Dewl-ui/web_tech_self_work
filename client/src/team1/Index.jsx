import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import CategoriesPage from "./pages/categories/CategoriesPage";
import CategoryDetailPage from "./pages/categories/CategoryDetailPage";
import CoursesPage from "./pages/courses/CoursesPage";
import CourseCreatePage from "./pages/courses/CourseCreatePage";
import CourseDetailPage from "./pages/courses/CourseDetailPage";
import CourseEditPage from "./pages/courses/CourseEditPage";
import CourseReportPage from "./pages/courses/CourseReportPage";
import LessonListPage from "./pages/lessons/LessonListPage";
import LessonCreatePage from "./pages/lessons/LessonCreatePage";
import LessonDetailPage from "./pages/lessons/LessonDetailPage";
import LessonEditPage from "./pages/lessons/LessonEditPage";
import RequestsPage from "./pages/admin/RequestsPage";
import SchoolsPage from "./pages/schools/SchoolsPage";
import SchoolCreatePage from "./pages/schools/SchoolCreatePage";
import SchoolDetailPage from "./pages/schools/SchoolDetailPage";
import SchoolEditPage from "./pages/schools/SchoolEditPage";
import SchoolReportPage from "./pages/schools/SchoolReportPage";

export default function Team1() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/create" element={<CourseCreatePage />} />
        <Route path="courses/edit/:courseId" element={<CourseEditPage />} />
        <Route path="courses/:course_id/report" element={<CourseReportPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:id" element={<CategoryDetailPage />} />
        <Route path="courses/:course_id" element={<CourseDetailPage />} />
        <Route path="courses/:course_id/lessons" element={<LessonListPage />} />
        <Route
          path="courses/:course_id/lessons/create"
          element={<LessonCreatePage />}
        />
        <Route path="lessons/create" element={<LessonCreatePage />} />
        <Route
          path="courses/:course_id/lessons/:lesson_id"
          element={<LessonDetailPage />}
        />
        <Route path="lessons/:lessonId" element={<LessonDetailPage />} />
        <Route path="lessons/edit/:lessonId" element={<LessonEditPage />} />
        <Route
          path="courses/:course_id/lessons/:lesson_id/edit"
          element={<LessonEditPage />}
        />
        <Route path="schools" element={<SchoolsPage />} />
        <Route path="schools/create" element={<SchoolCreatePage />} />
        <Route path="schools/:school_id" element={<SchoolDetailPage />} />
        <Route
          path="schools/:school_id/edit"
          element={<SchoolEditPage />}
        />
        <Route path="report" element={<SchoolReportPage />} />
        <Route path="admin/requests" element={<RequestsPage />} />
      </Route>
    </Routes>
  );
}
