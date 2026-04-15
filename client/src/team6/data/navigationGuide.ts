/**
 * ExamHub Navigation Guide
 * Complete list of all 33 screens in the system
 */

export const navigationGuide = {
  teacher: {
    title: "Teacher Portal",
    screens: [
      {
        id: 1,
        name: "Teacher Login",
        path: "/teacher/login",
        description: "Authentication page for teachers",
        features: ["Email/password login", "Remember me option", "Forgot password link"]
      },
      {
        id: 2,
        name: "Teacher Dashboard",
        path: "/teacher/dashboard",
        description: "Main dashboard with overview and statistics",
        features: ["Stats widgets (courses, exams, students)", "Upcoming exams list", "Recent activity", "Quick actions"]
      },
      {
        id: 3,
        name: "Course List",
        path: "/teacher/dashboard/courses",
        description: "Grid view of all courses",
        features: ["Course cards with stats", "Add course button", "Student and exam counts"]
      },
      {
        id: 4,
        name: "Course Detail",
        path: "/teacher/dashboard/courses/:courseId",
        description: "Detailed view of a specific course",
        features: ["Course info header", "Stats overview", "Exams list for the course", "Create exam button"]
      },
      {
        id: 5,
        name: "Exams List",
        path: "/teacher/dashboard/courses/:courseId/exams",
        description: "List of all exams with filters",
        features: ["Search functionality", "Filter options", "Exam status badges", "Comprehensive exam cards"]
      },
      {
        id: 6,
        name: "Create Exam",
        path: "/teacher/dashboard/courses/:courseId/exams/create",
        description: "Form to create a new exam",
        features: ["Title and description", "Duration and marks", "Start/end date & time", "Randomize questions toggle"]
      },
      {
        id: 7,
        name: "Exam Detail",
        path: "/teacher/dashboard/exams/:examId",
        description: "Complete exam overview with questions",
        features: ["Exam metadata", "Questions list", "Add question button", "Publish dialog", "Edit and delete options"]
      },
      {
        id: 8,
        name: "Edit Exam",
        path: "/teacher/dashboard/exams/:examId/edit",
        description: "Edit exam details",
        features: ["Pre-filled form", "Update exam settings", "Save changes"]
      },
      {
        id: 9,
        name: "Exam Variants List",
        path: "/teacher/dashboard/exams/:examId/variants",
        description: "Manage exam variants",
        features: ["Variant cards", "Create variant button", "Variant statistics"]
      },
      {
        id: 10,
        name: "Create Variant",
        path: "/teacher/dashboard/exams/:examId/variants/create",
        description: "Create a new exam variant",
        features: ["Variant name", "Description", "Auto-assignment info"]
      },
      {
        id: 11,
        name: "Variant Detail",
        path: "/teacher/dashboard/exams/:examId/variants/:variantId",
        description: "View variant details",
        features: ["Variant info", "Questions list", "Student assignments", "Edit/delete options"]
      },
      {
        id: 12,
        name: "Question Type Selector",
        path: "/teacher/dashboard/exams/:examId/questions/add",
        description: "Choose question type to add",
        features: ["Multiple choice card", "True/False card", "Short answer card"]
      },
      {
        id: 13,
        name: "Create Multiple Choice",
        path: "/teacher/dashboard/exams/:examId/questions/multiple-choice",
        description: "Create multiple choice question",
        features: ["Question text", "Options (A, B, C, D)", "Correct answer selection", "Marks", "Add/remove options"]
      },
      {
        id: 14,
        name: "Create True/False",
        path: "/teacher/dashboard/exams/:examId/questions/true-false",
        description: "Create true/false question",
        features: ["Question text", "True/False selection", "Marks"]
      },
      {
        id: 15,
        name: "Create Short Answer",
        path: "/teacher/dashboard/exams/:examId/questions/short-answer",
        description: "Create short answer question",
        features: ["Question text", "Sample answer", "Marks", "Grading notes"]
      },
      {
        id: 16,
        name: "Exam Report",
        path: "/teacher/dashboard/exams/:examId/report",
        description: "Analytics and reports with charts",
        features: ["Average/highest/lowest scores", "Pass rate", "Pie chart (grade distribution)", "Bar chart (score distribution)", "Top performers"]
      },
      {
        id: 17,
        name: "Student Results Table",
        path: "/teacher/dashboard/exams/:examId/results",
        description: "Table of all student results",
        features: ["Student name and ID", "Score and percentage", "Submission time", "Status badges", "View detail button", "Export to CSV"]
      },
      {
        id: 18,
        name: "Student Result Detail",
        path: "/teacher/dashboard/exams/:examId/results/:studentId",
        description: "Detailed view of individual student result",
        features: ["Student info", "Score breakdown", "Answer review (correct/incorrect)", "Question-by-question analysis", "Download PDF"]
      }
    ]
  },
  student: {
    title: "Student Portal",
    screens: [
      {
        id: 19,
        name: "Student Login",
        path: "/student/login",
        description: "Authentication page for students",
        features: ["Email/password login", "Remember me option", "Link to teacher login"]
      },
      {
        id: 20,
        name: "Student Dashboard",
        path: "/student/dashboard",
        description: "Student home with upcoming exams",
        features: ["Welcome banner", "Stats (upcoming, completed, average)", "Upcoming exams cards", "Recent activity"]
      },
      {
        id: 21,
        name: "Available Exams",
        path: "/student/dashboard/exams",
        description: "List of all available and completed exams",
        features: ["Available exams section", "Completed exams section", "Exam details", "Start exam button"]
      },
      {
        id: 22,
        name: "Exam Instructions",
        path: "/student/dashboard/exams/:examId/instructions",
        description: "Pre-exam instructions and rules",
        features: ["Exam details (duration, marks, questions)", "Instructions list", "Important notes", "Fullscreen suggestion", "Agreement checkbox", "Start exam button"]
      },
      {
        id: 23,
        name: "Exam Taking - Multiple Choice",
        path: "/student/exams/:examId/take",
        description: "Taking exam with timer and auto-save",
        features: ["Live timer", "Progress bar", "Question navigation", "Multiple choice interface", "Mark for review", "Auto-save indicator", "Online/offline detection"]
      },
      {
        id: 24,
        name: "Exam Taking - True/False",
        path: "/student/exams/:examId/take",
        description: "True/False question interface",
        features: ["True/False buttons", "Selection highlighting", "Navigation"]
      },
      {
        id: 25,
        name: "Exam Taking - Short Answer",
        path: "/student/exams/:examId/take",
        description: "Short answer question interface",
        features: ["Text area for answer", "Character count", "Auto-save"]
      },
      {
        id: 26,
        name: "Exam Taking Sidebar",
        path: "/student/exams/:examId/take",
        description: "Question navigator sidebar",
        features: ["Question palette", "Color-coded status", "Current question indicator", "Legend"]
      },
      {
        id: 27,
        name: "Review Answers",
        path: "/student/exams/:examId/review-answers",
        description: "Review all answers before submission",
        features: ["Question-by-question review", "Answered/unanswered indicators", "Navigation", "Submit confirmation dialog"]
      },
      {
        id: 28,
        name: "Submit Confirmation",
        path: "/student/exams/:examId/review-answers",
        description: "Final submission dialog",
        features: ["Summary (answered, unanswered)", "Confirmation button", "Go back option"]
      },
      {
        id: 29,
        name: "Auto-Submit Screen",
        path: "/student/exams/:examId/take",
        description: "Time expired auto-submit",
        features: ["Time warning at 5 minutes", "Auto-submit at 0:00", "Redirect to results"]
      },
      {
        id: 30,
        name: "Exam Result",
        path: "/student/dashboard/exams/:examId/result",
        description: "Result page with score and analytics",
        features: ["Success banner", "Score percentage", "Grade", "Stats (correct, wrong, time)", "Performance bars", "Review answers button", "Download PDF"]
      },
      {
        id: 31,
        name: "Answer Review",
        path: "/student/dashboard/exams/:examId/review",
        description: "Compare answers with correct ones",
        features: ["Question-by-question review", "Correct/incorrect indicators", "Student answer vs correct answer", "Navigation", "Score sidebar"]
      }
    ]
  },
  shared: {
    title: "Shared Screens",
    screens: [
      {
        id: 32,
        name: "404 Not Found",
        path: "*",
        description: "Page not found error",
        features: ["404 message", "Links to teacher/student dashboards"]
      },
      {
        id: 33,
        name: "Offline Warning",
        path: "All pages",
        description: "Internet connection warning banner",
        features: ["Real-time connection detection", "Warning banner", "Auto-hide when online"]
      }
    ]
  }
};

export const featureList = {
  uxFeatures: [
    "Clean academic UI with card-based layout",
    "Soft shadows and 8px rounded corners",
    "Responsive design (desktop-first, 1440px)",
    "Inter font family",
    "Primary color: #3B82F6 (blue)",
    "Secondary color: #F3F4F6 (light gray)",
    "Toast notifications for actions",
    "Loading states",
    "Empty states with illustrations",
    "Error states with helpful messages"
  ],
  examFeatures: [
    "Multiple question types (MCQ, True/False, Short Answer)",
    "Question randomization",
    "Exam variants",
    "Timer with countdown",
    "Auto-save every 30 seconds",
    "Time warning at 5 minutes",
    "Auto-submit on time expiry",
    "Mark questions for review",
    "Question navigator sidebar",
    "Progress tracking",
    "Offline detection",
    "Copy-paste prevention (UI indication)",
    "Fullscreen mode suggestion"
  ],
  teacherFeatures: [
    "Dashboard with statistics",
    "Course management",
    "Exam creation and editing",
    "Question bank management",
    "Multiple question types",
    "Exam variants creation",
    "Publishing workflow",
    "Results viewing",
    "Analytics and reports",
    "Charts (Pie and Bar)",
    "Student results table",
    "Individual student result view",
    "Export options (CSV, PDF)"
  ],
  studentFeatures: [
    "Dashboard with upcoming exams",
    "Exam instructions page",
    "Interactive exam taking",
    "Answer review before submission",
    "Results page with analytics",
    "Answer comparison with correct answers",
    "Performance tracking",
    "Recent activity"
  ]
};

export const quickStartPaths = {
  teacher: {
    login: "/teacher/login",
    start: "/teacher/dashboard",
    createExam: "/teacher/dashboard/courses/1/exams/create",
    viewResults: "/teacher/dashboard/exams/1/report"
  },
  student: {
    login: "/student/login",
    start: "/student/dashboard",
    takeExam: "/student/dashboard/exams/1/instructions",
    viewResult: "/student/dashboard/exams/1/result"
  }
};
