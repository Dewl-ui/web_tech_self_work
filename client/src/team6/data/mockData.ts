export interface Course {
  id: string;
  name: string;
  code: string;
  semester: string;
  studentsCount: number;
  examsCount: number;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  startTime: string;
  endTime: string;
  randomizeQuestions: boolean;
  status: "draft" | "published" | "completed";
  questionsCount: number;
  studentsAttempted: number;
}

export interface Question {
  id: string;
  examId: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  question: string;
  marks: number;
  options?: string[];
  correctAnswer: string | number;
  order: number;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | number;
  isCorrect?: boolean;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  answers: StudentAnswer[];
  score?: number;
  percentage?: number;
  status: "in-progress" | "submitted" | "auto-submitted";
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
}

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Өгөгдлийн бүтэц ба алгоритмууд",
    code: "CS201",
    semester: "Намар 2026",
    studentsCount: 45,
    examsCount: 3,
  },
  {
    id: "2",
    name: "Өгөгдлийн сангийн удирдлагын системүүд",
    code: "CS301",
    semester: "Намар 2026",
    studentsCount: 38,
    examsCount: 2,
  },
  {
    id: "3",
    name: "Вэб хөгжүүлэлтийн үндэс",
    code: "CS205",
    semester: "Намар 2026",
    studentsCount: 52,
    examsCount: 4,
  },
  {
    id: "4",
    name: "Үйлдлийн систем",
    code: "CS302",
    semester: "Намар 2026",
    studentsCount: 41,
    examsCount: 2,
  },
];

export const mockExams: Exam[] = [
  {
    id: "1",
    title: "Явцын шалгалт - Мод ба графикууд",
    courseId: "1",
    courseName: "Өгөгдлийн бүтэц ба алгоритмууд",
    description:
      "Хоёртын мод, AVL мод, график алгоритмуудыг хамарсан цогц шалгалт",
    duration: 90,
    totalMarks: 100,
    startTime: "2026-03-15T10:00:00",
    endTime: "2026-03-15T11:30:00",
    randomizeQuestions: true,
    status: "published",
    questionsCount: 25,
    studentsAttempted: 42,
  },
  {
    id: "2",
    title: "Эцсийн шалгалт - Цогц",
    courseId: "1",
    courseName: "Өгөгдлийн бүтэц ба алгоритмууд",
    description: "Эцсийн шалгалт - Цогц асуултууд болон код бичих даалгаврууд",
    duration: 120,
    totalMarks: 150,
    startTime: "2026-05-20T14:00:00",
    endTime: "2026-05-20T16:00:00",
    randomizeQuestions: false,
    status: "draft",
    questionsCount: 40,
    studentsAttempted: 0,
  },
  {
    id: "3",
    title: "Асуулт 1 - SQL Үндсэн ойлголтууд",
    courseId: "2",
    courseName: "Өгөгдлийн сангийн удирдлагын системүүд",
    description: "SQL query болон мэдээллийн сангийн дизайны талаарх шалгалт",
    duration: 30,
    totalMarks: 30,
    startTime: "2026-03-10T09:00:00",
    endTime: "2026-03-10T09:30:00",
    randomizeQuestions: true,
    status: "completed",
    questionsCount: 15,
    studentsAttempted: 38,
  },
  {
    id: "4",
    title: "Явцын шалгалт - Хэвийн болгох ба гүйлгээ",
    courseId: "2",
    courseName: "Өгөгдлийн сангийн удирдлагын системүүд",
    description:
      "Өгөгдлийн сангийн хэвийн байдал болон гүйлгээний менежментийн шалгалт",
    duration: 75,
    totalMarks: 80,
    startTime: "2026-04-05T13:00:00",
    endTime: "2026-04-05T14:15:00",
    randomizeQuestions: false,
    status: "published",
    questionsCount: 20,
    studentsAttempted: 15,
  },
];

export const mockQuestions: Question[] = [
  {
    id: "q1",
    examId: "1",
    type: "multiple-choice",
    question:
      "What is the time complexity of searching in a balanced binary search tree?",
    marks: 4,
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    order: 1,
  },
  {
    id: "q2",
    examId: "1",
    type: "multiple-choice",
    question: "Which traversal method visits the root node first?",
    marks: 4,
    options: ["Inorder", "Preorder", "Postorder", "Level-order"],
    correctAnswer: 1,
    order: 2,
  },
  {
    id: "q3",
    examId: "1",
    type: "true-false",
    question: "An AVL tree is always a complete binary tree.",
    marks: 3,
    correctAnswer: "false",
    order: 3,
  },
  {
    id: "q4",
    examId: "1",
    type: "short-answer",
    question:
      "Explain the difference between BFS and DFS graph traversal algorithms.",
    marks: 10,
    correctAnswer:
      "BFS explores level by level using a queue, while DFS explores depth-first using a stack.",
    order: 4,
  },
  {
    id: "q5",
    examId: "1",
    type: "multiple-choice",
    question: "What data structure is used to implement a priority queue?",
    marks: 4,
    options: ["Array", "Linked List", "Heap", "Stack"],
    correctAnswer: 2,
    order: 5,
  },
];

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Alice Johnson",
    email: "alice.j@university.edu",
    studentId: "STU001",
  },
  {
    id: "s2",
    name: "Bob Smith",
    email: "bob.s@university.edu",
    studentId: "STU002",
  },
  {
    id: "s3",
    name: "Carol Williams",
    email: "carol.w@university.edu",
    studentId: "STU003",
  },
  {
    id: "s4",
    name: "David Brown",
    email: "david.b@university.edu",
    studentId: "STU004",
  },
  {
    id: "s5",
    name: "Emma Davis",
    email: "emma.d@university.edu",
    studentId: "STU005",
  },
];

export const mockExamAttempts: ExamAttempt[] = [
  {
    id: "a1",
    examId: "1",
    studentId: "s1",
    studentName: "Alice Johnson",
    startedAt: "2026-03-15T10:00:00",
    submittedAt: "2026-03-15T11:15:00",
    answers: [
      { questionId: "q1", answer: 1, isCorrect: true },
      { questionId: "q2", answer: 1, isCorrect: true },
      { questionId: "q3", answer: "false", isCorrect: true },
      {
        questionId: "q4",
        answer: "BFS uses queue, DFS uses stack",
        isCorrect: true,
      },
      { questionId: "q5", answer: 2, isCorrect: true },
    ],
    score: 92,
    percentage: 92,
    status: "submitted",
  },
  {
    id: "a2",
    examId: "1",
    studentId: "s2",
    studentName: "Bob Smith",
    startedAt: "2026-03-15T10:00:00",
    submittedAt: "2026-03-15T11:25:00",
    answers: [
      { questionId: "q1", answer: 1, isCorrect: true },
      { questionId: "q2", answer: 0, isCorrect: false },
      { questionId: "q3", answer: "true", isCorrect: false },
      {
        questionId: "q4",
        answer: "Both are traversal methods",
        isCorrect: false,
      },
      { questionId: "q5", answer: 2, isCorrect: true },
    ],
    score: 68,
    percentage: 68,
    status: "submitted",
  },
  {
    id: "a3",
    examId: "1",
    studentId: "s3",
    studentName: "Carol Williams",
    startedAt: "2026-03-15T10:00:00",
    submittedAt: "2026-03-15T11:20:00",
    answers: [
      { questionId: "q1", answer: 1, isCorrect: true },
      { questionId: "q2", answer: 1, isCorrect: true },
      { questionId: "q3", answer: "false", isCorrect: true },
      {
        questionId: "q4",
        answer: "BFS is breadth-first, DFS is depth-first",
        isCorrect: true,
      },
      { questionId: "q5", answer: 1, isCorrect: false },
    ],
    score: 85,
    percentage: 85,
    status: "submitted",
  },
];

export const currentStudent: Student = {
  id: "s1",
  name: "Alice Johnson",
  email: "alice.j@university.edu",
  studentId: "STU001",
};
