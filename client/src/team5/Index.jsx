import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import QuestionList from "./pages/QuestionList";
import Dashboard from "./pages/Dashboard"; 
import Login from "../layout/Login"; 
import QuestionReport from "./pages/QuestionReport";


// Компонентуудыг импортлох
import QuestionCreate from "./pages/QuestionCreate"; 
import QuestionTypes from "./pages/QuestionTypes"; 
import QuestionLevels from "./pages/QuestionLevels";

// ХЭРЭВ CourseCreate файл байхгүй бол энэ мөрийг comment болгох:
// import CourseCreate from "./pages/CourseCreate"; 

const Index = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      
      <Route path="" element={<Layout />}>
        <Route index element={<Dashboard />} /> 
        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Асуулттай холбоотой замууд */}
        <Route path="courses/:course_id/questions">
          <Route index element={<QuestionList />} />
          <Route path="create" element={<QuestionCreate />} />
          <Route path="types" element={<QuestionTypes />} />
          <Route path="levels" element={<QuestionLevels />} />
          <Route path="report" element={<QuestionReport />} />
        </Route>

        {/* Шинэ хичээл нэмэх зам */}
        {/* CourseCreate файл бэлэн болох хүртэл QuestionCreate-ийг түр ашиглаж болно */}
        <Route path="courses/create" element={<QuestionCreate />} />
      </Route>

      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default Index;