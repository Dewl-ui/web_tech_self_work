import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Dashboard from "./pages/Dashboard";
import QuestionList from "./pages/QuestionList";
import QuestionCreate from "./pages/QuestionCreate";
import QuestionEdit from "./pages/QuestionEdit";
import QuestionView from "./pages/QuestionView";
import QuestionTypes from "./pages/QuestionTypes";
import QuestionLevels from "./pages/QuestionLevels";
import QuestionPoints from "./pages/QuestionPoints";
import QuestionReport from "./pages/QuestionReport";

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="home" element={<Home />} />
        <Route path="question-types" element={<QuestionTypes />} />
        <Route path="question-levels" element={<QuestionLevels />} />
        <Route path="courses/:course_id/questions">
          <Route index element={<QuestionList />} />
          <Route path="create" element={<QuestionCreate />} />
          <Route path="report" element={<QuestionReport />} />
          <Route path=":question_id" element={<QuestionView />} />
          <Route path=":question_id/edit" element={<QuestionEdit />} />
        </Route>
        <Route
          path="courses/:course_id/question-points"
          element={<QuestionPoints />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/team5" replace />} />
    </Routes>
  );
};

export default Index;
