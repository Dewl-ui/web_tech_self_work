import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import Layout from "./Layout";

import authRoutes    from "./pages/auth/routes";    // public — no layout
import sharedRoutes  from "./pages/shared/routes";  // home, profile, schools
import adminRoutes   from "./pages/admin/routes";   // Member A
import teacherRoutes from "./pages/teacher/routes"; // Member B
import studentRoutes from "./pages/student/routes"; // Member C

export default function Team4() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public auth routes — no layout wrapper */}
        {authRoutes}

        {/* Protected routes — wrapped in sidebar + header layout */}
        <Route element={<Layout />}>
          {sharedRoutes}
          {adminRoutes}
          {teacherRoutes}
          {studentRoutes}
        </Route>
      </Routes>
    </AuthProvider>
  );
}
