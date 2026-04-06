const BASE_URL = "https://todu.mn/bs/lms/v1";

// Токенийг localStorage-оос авах функц
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

export const api = {
  // ==========================================
  // 1. Асуултын Төрөл (Question Type)
  // ==========================================
  async fetchQuestionTypes() {
    const response = await fetch(`${BASE_URL}/question-types`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Асуултын төрлийг авч чадсангүй");
    return response.json();
  },

  // ==========================================
  // 2. Асуултын Түвшин (Question Level)
  // ==========================================
  async fetchQuestionLevels() {
    const response = await fetch(`${BASE_URL}/question-levels`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Асуултын түвшинг авч чадсангүй");
    return response.json();
  },

  // ==========================================
  // 3. Асуултууд (Questions)
  // ==========================================
  // Хичээлийн (course_id) бүх асуултуудыг авах
  async fetchQuestions(courseId) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/questions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Асуултуудыг ачаалахад алдаа гарлаа");
    return response.json();
  },

  // Нэг асуултыг ID-аар нь харах
  async fetchQuestionById(courseId, questionId) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/questions/${questionId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Асуултыг олдсонгүй");
    return response.json();
  },

  // Шинэ асуулт үүсгэх (сонох, харгалзуулах, нөхөх г.м)
  async createQuestion(courseId, questionData) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/questions`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(questionData),
    });
    if (!response.ok) throw new Error("Асуулт хадгалахад алдаа гарлаа");
    return response.json();
  },

  // Асуулт засах
  async updateQuestion(courseId, questionId, questionData) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/questions/${questionId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(questionData),
    });
    if (!response.ok) throw new Error("Асуулт шинэчлэхэд алдаа гарлаа");
    return response.json();
  },

  // ==========================================
  // 4. Асуултын Оноо (Question Points)
  // ==========================================
  async fetchQuestionPoints(courseId) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/question-points`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Онооны мэдээлэл авч чадсангүй");
    return response.json();
  },

  async updateQuestionPoint(courseId, pointData) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/question-points`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(pointData),
    });
    if (!response.ok) throw new Error("Оноо шинэчлэхэд алдаа гарлаа");
    return response.json();
  },

  // ==========================================
  // 5. Тайлан & Статистик (Report)
  // ==========================================
  async fetchQuestionReport(courseId) {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/questions/report`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Тайлан ачаалахад алдаа гарлаа");
    return response.json();
  }
};