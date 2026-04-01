import { Routes, Route } from "react-router-dom";

// Layout & Common
import Layout from "./Layout";
import Home from "./Home";
import Example from "./Example";

// Question Bank Pages
import QuestionTypes from "./pages/QuestionTypes";
import QuestionLevels from "./pages/QuestionLevels";
import QuestionList from "./pages/QuestionList";
import QuestionPoints from "./pages/QuestionPoints";
import QuestionCreate from "./pages/QuestionCreate";
import QuestionView from "./pages/QuestionView";
import QuestionEdit from "./pages/QuestionEdit";
import QuestionReport from "./pages/QuestionReport";

// Dashboard
import Dashboard from "./pages/Dashboard";     // ← Зөв import

const Index = () => {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        {/* Home */}
        <Route index element={<Home />} />
        <Route path="example" element={<Example />} />

        {/* Question Bank Routes */}
        <Route path="question-types" element={<QuestionTypes />} />
        <Route path="question-levels" element={<QuestionLevels />} />

        {/* Courses + Questions Nested Routes */}
        <Route path="courses/:course_id/questions">
          <Route index element={<QuestionList />} />
          <Route path="create" element={<QuestionCreate />} />
          <Route path="report" element={<QuestionReport />} />
          <Route path=":question_id" element={<QuestionView />} />
          <Route path=":question_id/edit" element={<QuestionEdit />} />
        </Route>

        <Route path="courses/:course_id/question-points" element={<QuestionPoints />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default Index;