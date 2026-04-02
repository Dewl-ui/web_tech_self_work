const SAMPLE_VIDEO = "https://www.youtube.com/watch?v=dGcsHMXbSOA";
const SAMPLE_FILE =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export const mockLessons = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  title: `${i + 1} долоо хоног`,
  lessons: [
    {
      id: (i + 1) * 10 + 1,
      name: `Лекц ${i + 1} (Видео)`,
      type: "video",
      videoUrl: SAMPLE_VIDEO,
      content: `Видео хичээлийн товч танилцуулга ${i + 1}.`,
      dueDate: "",
      file: "",
      submitted: false,
    },
    {
      id: (i + 1) * 10 + 2,
      name:
        i % 2 === 0
          ? `Лабораторийн ажил ${i + 1}`
          : `Нэмэлт материал ${i + 1}`,
      type: i % 2 === 0 ? "text" : "file",
      videoUrl: "",
      content:
        i % 2 === 0
          ? `Энэ хэсэгт ${i + 1}-р долоо хоногийн текст материал байна.`
          : "",
      dueDate: "",
      file: i % 2 === 0 ? "" : SAMPLE_FILE,
      submitted: false,
    },
    {
      id: (i + 1) * 10 + 3,
      name: `Бие даалт ${i + 1}`,
      type: "assignment",
      videoUrl: "",
      content: `${i + 1}-р долоо хоногийн даалгаврын тайлбар болон шалгуур.`,
      dueDate: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String(
        ((i % 27) + 1) + 1
      ).padStart(2, "0")}`,
      file: "",
      materials: [
        {
          id: `${i + 1}-brief`,
          name: "Сем",
          meta: "PDF Document • 2.4 MB",
          action: "Татаж авах",
        },
        {
          id: `${i + 1}-guide`,
          name: "Сем",
          meta: "PDF Document • 1.8 MB",
          action: "Татаж авах",
        },
      ],
      submitted: false,
    },
  ],
}));
