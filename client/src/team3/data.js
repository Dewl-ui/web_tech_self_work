export const studentProfile = {
  name: 'Бат',
  code: 'B241940083',
  school: 'Мэдээлэл, холбооны технологийн сургууль',
  department: 'Мэдээллийн технологи',
  major: 'Мэдээллийн технологи',
  credits: 58,
  gpa: 3.7,
};

export const semesters = [
  {
    id: '2024-fall',
    title: '2024-2025 оны хичээлийн жил. 1-р улирал',
    items: [
      { id: 1, code: 'F.CSM202', name: 'Хичээл1', credit: '3 кр', irts: 65, exam: 28, total: 93, letter: 'A-', point: 3.7, teacherCode: 'F.CS11', teacher: 'Багш1' },
      { id: 2, code: 'S.MTM122', name: 'Хичээл2', credit: '3 кр', irts: 64, exam: 22, total: 86, letter: 'B', point: 3, teacherCode: 'K.SS45', teacher: 'Багш2' },
      { id: 3, code: 'S.EEM102', name: 'Хичээл3', credit: '3 кр', irts: 66, exam: 27, total: 93, letter: 'A-', point: 3.7, teacherCode: 'F.IT06', teacher: 'Багш3' },
    ],
  },
  {
    id: '2025-spring',
    title: '2024-2025 оны хичээлийн жил. 2-р улирал',
    items: [
      { id: 4, code: 'F.CSM202', name: 'Хичээл1', credit: '3 кр', irts: 65, exam: 28, total: 93, letter: 'A-', point: 3.7, teacherCode: 'F.CS11', teacher: 'Багш1' },
      { id: 5, code: 'S.MTM122', name: 'Хичээл2', credit: '3 кр', irts: 64, exam: 22, total: 86, letter: 'B', point: 3, teacherCode: 'K.SS45', teacher: 'Багш2' },
      { id: 6, code: 'S.EEM102', name: 'Хичээл3', credit: '3 кр', irts: 66, exam: 27, total: 93, letter: 'A-', point: 3.7, teacherCode: 'F.IT06', teacher: 'Багш3' },
    ],
  },
];

export const gradeCards = [
  { id: '1', code: 'S.MTM121', title: 'Математик', percent: '80%', grade: 'Голч дүн: 2.4', mark: '+C', color: 'bg-rose-400' },
  { id: '2', code: 'S.CDM101', title: 'Гамшгаас хамгаалах менежмент', percent: '100%', grade: 'Голч дүн: 4', mark: 'A', color: 'bg-amber-300' },
  { id: '3', code: 'S.MHM101', title: 'Монголын түүх', percent: '100%', grade: 'Голч дүн: 4', mark: 'A', color: 'bg-indigo-400' },
  { id: '4', code: 'S.MHM101', title: 'Монголын түүх', percent: '100%', grade: 'Голч дүн: 4', mark: 'A', color: 'bg-orange-300' },
  { id: '5', code: 'S.MHM101', title: 'Монголын түүх', percent: '100%', grade: 'Голч дүн: 4', mark: 'A', color: 'bg-red-300' },
  { id: '6', code: 'S.MHM101', title: 'Монголын түүх', percent: '100%', grade: 'Голч дүн: 4', mark: 'A', color: 'bg-sky-300' },
  { id: '7', code: 'S.MHM101', title: 'Монголын түүх', percent: '100%', grade: 'Голч дүн: 4', mark: 'A', color: 'bg-fuchsia-300' },
  { id: '8', code: 'S.MHM101', title: 'Монголын түүх', percent: '100%', grade: 'Голч дүн: 4', mark: 'A', color: 'bg-green-300' },
  { id: '9', code: 'S.MHM101', title: 'Монголын түүх', percent: '100%', grade: 'Голч дүн: 4', mark: 'A', color: 'bg-lime-300' },
];

export const detailScores = [
  { id: 1, type: 'Багаар ажиллах', got: 5, max: 5, note: '' },
  { id: 2, type: 'Бие даалт', got: 20, max: 20, note: 'Сайн' },
  { id: 3, type: 'Сорил 1', got: 9.5, max: 10, note: '' },
];

export const attendanceWeekCards = Array.from({ length: 5 }).map((_, i) => ({ id: i + 1, label: `${i + 1}-р өдөр`, status: 'present' }));

export const leaveRequests = [
  { id: 1, student: 'Оюутан 1', course: '№', answer: '№', status: 'Хүлээгдэж буй' },
  { id: 2, student: 'Оюутан 2', course: '№', answer: 'а', status: 'Зөвшөөрсөн' },
  { id: 3, student: 'Оюутан 3', course: '№', answer: 'а', status: 'Зөвшөөрсөн' },
  { id: 4, student: 'Оюутан 4', course: '№', answer: 'а', status: 'Татгалзсан' },
];

export const journalCourses = [
  { id: 'mtm121', code: 'S.MTM121', name: 'Математик', group: 'Танхим', students: 100 },
  { id: 'mhm101', code: 'S.MHM101', name: 'Монголын түүх', group: 'Танхим', students: 100 },
  { id: 'phm101', code: 'S.PHM101', name: 'Физик', group: 'Танхим', students: 100 },
  { id: 'ptm101', code: 'S.PTM101', name: 'Биеийн тамир', group: 'Танхим', students: 100 },
];

export const courseStudents = [
  { code: 'B221870406', name: 'Б. Отгонбат', phone: '+976 ********' },
  { code: 'B221870407', name: 'Д. Саруул', phone: '+976 ********' },
  { code: 'B221870408', name: 'Ж. Мишээл', phone: '+976 ********' },
];

export const teacherInfo = {
  name: 'Б.АЛТ /Г.С/',
  role: 'Албан тушаал: Багш',
  email: 'Мэйл хаяг: @must.edu.mn',
  phone1: 'Утас 1:',
  phone2: 'Утас 2:',
};

export const teacherAttendanceRows = [
  { slot: '1-4', type: 'Лекц', group: '229', date: '2026/03/09', attendanceText: 'Бүртгэх' },
  { slot: '2-4', type: 'Лаборатор', group: '317', date: '2026/03/10', attendanceText: 'Бүртгэх' },
  { slot: '2-5', type: 'Лаборатор', group: '317', date: '2026/03/10', attendanceText: 'Бүртгэх' },
  { slot: '2-6', type: 'Лаборатор', group: '213', date: '2026/03/10', attendanceText: 'Бүртгэх' },
  { slot: '4-5', type: 'Лаборатор', group: '213', date: '2026/03/13', attendanceText: 'Бүртгэх' },
];

export const lessonStudents = [
  { name: 'А.Мишээл', code: 'B221876552', present: true, absent: false, sick: false, excused: false },
  { name: 'А.Мишээл', code: 'B221876552', present: true, absent: false, sick: false, excused: false },
  { name: 'А.Мишээл', code: 'B221876552', present: true, absent: false, sick: false, excused: false },
  { name: 'А.Мишээл', code: 'B221876552', present: false, absent: false, sick: true, excused: false },
  { name: 'А.Мишээл', code: 'B221876552', present: false, absent: true, sick: false, excused: false },
  { name: 'А.Мишээл', code: 'B221876552', present: true, absent: false, sick: false, excused: false },
  { name: 'А.Мишээл', code: 'B221876552', present: false, absent: false, sick: true, excused: false },
];

export const attendanceSummaryLecture = [
  { name: 'Ирсэн', value: 57, fill: '#58df70' },
  { name: 'Тасалсан', value: 10, fill: '#f26d6d' },
  { name: 'Өвчтэй', value: 4, fill: '#c07cf3' },
  { name: 'Чөлөөтэй', value: 3, fill: '#e6dc4a' },
];

export const attendanceSummaryLab = [
  { name: 'Ирсэн', value: 12, fill: '#58df70' },
  { name: 'Тасалсан', value: 1, fill: '#f26d6d' },
  { name: 'Өвчтэй', value: 2, fill: '#c07cf3' },
  { name: 'Чөлөөтэй', value: 3, fill: '#e6dc4a' },
];
