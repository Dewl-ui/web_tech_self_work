export const dashboardStats = {
  totalCourses: 4,
  activeExams: 2,
  totalStudents: 176,
};

export const upcomingExams = [
  {
    id: 1,
    title: "Завсрын шалгалт - Мод ба графикууд",
    meta: "90 минут · 25 асуулт · 42 оролцогч",
    date: "3-р сарын 15, 10:00",
  },
  {
    id: 2,
    title: "Дунд шатны шалгалт - Хэвийн болгох ба гүйлгээ",
    meta: "75 минут · 25 асуулт · 12 оролцогч",
    date: "3-р сарын 15, 10:00",
  },
];

export const recentActivities = [
  "Завсрын шалгалтын нийтлэгдсэн - Мод ба графикууд",
  "Graded 42 submissions",
  "2-р асуулт хариултыг үүсгэсэн - Дэвшилтэт SQL",
];

export const courses = [
  {
    id: 1,
    code: "CS201",
    semester: "2026 оны намар",
    name: "Өгөгдлийн бүтэц ба алгоритмууд",
    students: 45,
    exams: 3,
    average: "78.5%",
  },
  {
    id: 2,
    code: "CS301",
    semester: "2026 оны намар",
    name: "Өгөгдлийн сангийн удирдлагын системүүд",
    students: 38,
    exams: 2,
    average: "74.2%",
  },
  {
    id: 3,
    code: "CS205",
    semester: "2026 оны намар",
    name: "Вэб хөгжүүлэлт",
    students: 52,
    exams: 4,
    average: "81.3%",
  },
  {
    id: 4,
    code: "CS302",
    semester: "2026 оны намар",
    name: "Үйлдлийн системүүд",
    students: 41,
    exams: 2,
    average: "76.0%",
  },
];

export const examsByCourse = {
  1: [
    {
      id: 1,
      title: "Завсрын шалгалт - Мод ба графикууд",
      course: "Өгөгдлийн бүтэц ба алгоритмууд",
      description: "Хоёртын мод, AVL мод, график алгоритмуудыг хамарсан цогц шалгалт",
      duration: "90 мин",
      score: 100,
      questions: 25,
      start: "3-р сарын 15, 10:00 цаг",
      participants: 12,
    },
    {
      id: 2,
      title: "Эцсийн шалгалт - Цогц",
      course: "Өгөгдлийн бүтэц ба алгоритмууд",
      description: "Семестрийн бүх сэдвийг хамарсан эцсийн шалгалт",
      duration: "120 мин",
      score: 150,
      questions: 40,
      start: "5-р сарын 05, 12:00 цаг",
      participants: 30,
    },
  ],
};

export const examDetails = {
  1: {
    id: 1,
    title: "Завсрын шалгалт - Мод ба графикууд",
    description: "Хоёртын мод, AVL мод, график алгоритмуудыг хамарсан цогц шалгалт",
    course: "Өгөгдлийн бүтэц ба алгоритмууд",
    duration: "90 мин",
    score: 100,
    questions: 2,
    start: "5-р сарын 05, 12:00 цаг",
    variants: [
      {
        name: "A хувилбар",
        questions: [
          {
            id: 1,
            type: "олон сонголттой",
            point: 2,
            text: "Тэнцвэртэй хоёртын хайлтын модонд хайлтын цагийн нарийн төвөгтэй байдал хэд вэ?",
            options: ["O(1)", "O(log n)"],
            correct: 1,
          },
          {
            id: 2,
            type: "үнэн/худал",
            point: 3,
            text: "AVL мод нь үргэлж бүрэн хоёртын мод байдаг.",
            options: ["Үнэн", "Худал"],
            correct: 1,
          },
        ],
      },
      {
        name: "Б хувилбар",
        questions: [
          {
            id: 1,
            type: "олон сонголттой",
            point: 2,
            text: "Тэнцвэртэй хоёртын хайлтын модонд хайлтын цагийн нарийн төвөгтэй байдал хэд вэ?",
            options: ["O(1)", "O(log n)"],
            correct: 1,
          },
        ],
      },
    ],
  },
};