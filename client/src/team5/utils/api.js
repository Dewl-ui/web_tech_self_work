const BASE_URL = "https://todu.mn/bs/lms/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

const api = {
  // Асуултын төрөл авах
  async fetchQuestionTypes() {
    const response = await fetch(`${BASE_URL}/question-types`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Асуултын төрлийг авч чадсангүй");
    return response.json();
  },

  // Асуултын түвшин авах
  async fetchQuestionLevels() {
    const response = await fetch(`${BASE_URL}/question-levels`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Асуултын түвшинг авч чадсангүй");
    return response.json();
  },

  // Хичээлийн хэсгүүдийг (Lessons) авах
  async fetchLessons(courseId) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/lessons`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Хичээлийн хэсгүүдийг авч чадсангүй");
    return response.json();
  },

  // Шинэ асуулт үүсгэх
  async createQuestion(courseId, questionData) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/questions`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(questionData),
    });
    if (!response.ok) throw new Error("Асуулт хадгалахад алдаа гарлаа");
    return response.json();
  },

  // Асуултуудын жагсаалт авах
  async fetchQuestions(courseId) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/questions`, { headers: getAuthHeaders() });
    return response.json();
  }
};

export default api;