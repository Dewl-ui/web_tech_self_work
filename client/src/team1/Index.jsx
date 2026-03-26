import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';

import CoursesPage from './pages/CoursesPage';
import CategoriesPage from './pages/CategoriesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonListPage from './pages/LessonListPage';
import LessonDetailPage from './pages/LessonDetailPage';

export default function Team1() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="courses/:course_id" element={<CourseDetailPage />} />
        <Route path="courses/:course_id/lessons" element={<LessonListPage />} />
        <Route
          path="courses/:course_id/lessons/:lesson_id"
          element={<LessonDetailPage />}
        />
      </Route>
    </Routes>
  );
}