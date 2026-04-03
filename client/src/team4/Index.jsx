/**
 * Team4 entry point — assembled once, then frozen.
 *
 * Ownership:
 *   pages/shared/   — infra / lead member (home, profile, schools)
 *   pages/admin/    — Member A            (admin pages)
 *   pages/teacher/  — Member B            (teacher pages)
 *   pages/student/  — Member C            (student pages)
 *   pages/auth/     — Member 1            (public auth pages)
 *
 * To add pages: edit ONLY your own routes.jsx inside your role folder.
 * Never edit this file or another member's routes file.
 */
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
