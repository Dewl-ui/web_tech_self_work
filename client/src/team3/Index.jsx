import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "./pages/home/Landing";
import StudentHome from "./pages/student/Home";
import StudentGradeCards from "./pages/student/GradeCards";
import StudentGrades from "./pages/student/Grades";
import StudentGradeDetail from "./pages/student/GradeDetail";
import StudentAssignment from "./pages/student/Assignment";
import StudentReportSelect from "./pages/student/ReportSelect";
import StudentReportItems from "./pages/student/ReportItems";
import StudentReportConfirm from "./pages/student/ReportConfirm";
import StudentAttendance from "./pages/student/Attendance";
import StudentCalendar from "./pages/student/Calendar";
import StudentLeave from "./pages/student/Leave";
import StudentSearchResult from "./pages/student/SearchResult";
import StudentRequestDetail from "./pages/student/RequestDetail";
import StudentReject from "./pages/student/RejectRequest";
import StudentAct from "./pages/student/Act";
import StudentActSuccess from "./pages/student/ActSuccess";
import StudentSettings from "./pages/student/Settings";
import TeacherHome from "./pages/teacher/Home";
import TeacherJournal from "./pages/teacher/Journal";
import TeacherCourseSummary from "./pages/teacher/CourseSummary";
import TeacherCourseStudents from "./pages/teacher/CourseStudents";
import TeacherCourseBreakdown from "./pages/teacher/CourseBreakdown";
import TeacherCourseTeacherInfo from "./pages/teacher/CourseTeacherInfo";
import TeacherAttendanceIndex from "./pages/teacher/AttendanceIndex";
import TeacherAttendanceLesson from "./pages/teacher/AttendanceLesson";
import TeacherAttendanceLessonSearch from "./pages/teacher/AttendanceLessonSearch";
import TeacherAttendanceLab from "./pages/teacher/AttendanceLab";
import TeacherConfirmLecture from "./pages/teacher/ConfirmLecture";
import TeacherConfirmLab from "./pages/teacher/ConfirmLab";
import TeacherAttendanceStats from "./pages/teacher/AttendanceStats";
import TeacherAttendanceStatsEmpty from "./pages/teacher/AttendanceStatsEmpty";
import TeacherRequests from "./pages/teacher/Requests";
import TeacherRequestDetail from "./pages/teacher/RequestDetail";
import TeacherRejectRequest from "./pages/teacher/RejectRequest";
import TeacherApproveRequest from "./pages/teacher/ApproveRequest";
import TeacherSettings from "./pages/teacher/Settings";

export default function Index() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />

        <Route path="student">
          <Route index element={<StudentHome />} />
          <Route path="grades" element={<StudentGradeCards />} />
          <Route path="grades/table" element={<StudentGrades />} />
          <Route path="grades/detail" element={<StudentGradeDetail />} />
          <Route
            path="grades/detail/assignment"
            element={<StudentAssignment />}
          />
          <Route
            path="grades/detail/report/select"
            element={<StudentReportSelect />}
          />
          <Route
            path="grades/detail/report/items"
            element={<StudentReportItems />}
          />
          <Route
            path="grades/detail/report/confirm"
            element={<StudentReportConfirm />}
          />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="calendar" element={<StudentCalendar />} />
          <Route path="leave" element={<StudentLeave />} />
          <Route path="leave/search" element={<StudentSearchResult />} />
          <Route path="leave/:requestId" element={<StudentRequestDetail />} />
          <Route path="leave/:requestId/reject" element={<StudentReject />} />
          <Route path="act" element={<StudentAct />} />
          <Route path="act/success" element={<StudentActSuccess />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        <Route path="teacher">
          <Route index element={<TeacherHome />} />
          <Route path="journal" element={<TeacherJournal />} />
          <Route
            path="journal/:courseId/summary"
            element={<TeacherCourseSummary />}
          />
          <Route
            path="journal/:courseId/students"
            element={<TeacherCourseStudents />}
          />
          <Route
            path="journal/:courseId/breakdown"
            element={<TeacherCourseBreakdown />}
          />
          <Route
            path="journal/:courseId/detail"
            element={<TeacherCourseBreakdown />}
          />
          <Route
            path="journal/:courseId/teacher"
            element={<TeacherCourseTeacherInfo />}
          />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="attendance" element={<TeacherAttendanceIndex />} />
          <Route
            path="attendance/lesson-1-4"
            element={<TeacherAttendanceLesson />}
          />
          <Route
            path="attendance/lesson-1-4/search"
            element={<TeacherAttendanceLessonSearch />}
          />
          <Route path="attendance/lab-2-4" element={<TeacherAttendanceLab />} />
          <Route
            path="attendance/confirm-lecture"
            element={<TeacherConfirmLecture />}
          />
          <Route
            path="attendance/confirm-lab"
            element={<TeacherConfirmLab />}
          />
          <Route path="attendance/stats" element={<TeacherAttendanceStats />} />
          <Route
            path="attendance/stats-empty"
            element={<TeacherAttendanceStatsEmpty />}
          />
          <Route path="requests" element={<TeacherRequests />} />
          <Route
            path="requests/:requestId"
            element={<TeacherRequestDetail />}
          />
          <Route
            path="requests/:requestId/reject"
            element={<TeacherRejectRequest />}
          />
          <Route
            path="requests/:requestId/approve"
            element={<TeacherApproveRequest />}
          />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
