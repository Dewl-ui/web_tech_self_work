import { Routes, Route, Navigate } from "react-router-dom";

// Layout & Common
import Layout from "./Layout";
import Home from "./Home";
import Example from "./Example";
import Login from "../layout/Login"; 

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
import Dashboard from "./pages/Dashboard";

//  Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

const Index = () => {
  return (
    <Routes>
      {/*  Login route (хамгаалалтгүй) */}
      <Route path="/login" element={<Login />} />

      {/*  Protected хэсэг */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Home */}
        <Route index element={<Home />} />
        <Route path="example" element={<Example />} />

        {/* Question Bank */}
        <Route path="question-types" element={<QuestionTypes />} />
        <Route path="question-levels" element={<QuestionLevels />} />

        {/* Courses + Questions */}
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

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default Index;