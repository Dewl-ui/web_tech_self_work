import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  mockExams,
  mockQuestions,
  mockExamAttempts,
} from "../../data/mockData";
import { generateStudentResultPDF } from "../../utils/pdfGenerator";

export function AnswerReview() {
  const { examId } = useParams();
  const exam = mockExams.find((e) => e.id === examId);
  const questions = mockQuestions.filter((q) => q.examId === examId);
  const attempt = mockExamAttempts.find((a) => a.examId === examId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  if (!exam || !attempt) return <div>Хянах одоогоор боломжгүй</div>;

  const studentAnswer = attempt.answers.find(
    (a) => a.questionId === currentQuestion.id,
  );
  const isCorrect = studentAnswer?.isCorrect || false;

  const handleDownloadPDF = () => {
    // Prepare question data for PDF
    const questionData = questions.map((question) => {
      const ans = attempt.answers.find((a) => a.questionId === question.id);

      return {
        question: question.question,
        type: question.type,
        marks: question.marks,
        studentAnswer: ans?.answer?.toString() || "No answer",
        correctAnswer: question.correctAnswer?.toString() || "",
        isCorrect: ans?.isCorrect || false,
        options: question.options,
      };
    });

    const correctCount = attempt.answers.filter((a) => a.isCorrect).length;
    const wrongCount = attempt.answers.filter((a) => !a.isCorrect).length;

    generateStudentResultPDF(
      {
        studentName: "John Doe", // In real app, this would come from auth context
        examTitle: exam.title,
        courseName: exam.courseName || "Course",
        score: attempt.score ?? 0,
        totalMarks: 100,
        percentage: attempt.score ?? 0,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        totalQuestions: questions.length,
        timeTaken: "75 minutes",
        submittedAt: attempt.submittedAt || new Date().toISOString(),
        grade:
          (attempt.score ?? 0) >= 90
            ? "A"
            : (attempt.score ?? 0) >= 80
              ? "B"
              : (attempt.score ?? 0) >= 70
                ? "C"
                : (attempt.score ?? 0) >= 60
                  ? "D"
                  : "F",
      },
      questionData,
    );
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div>
      <Link
        to={`/team6/student/exams/${examId}/result`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Шалгалт руу буцах
      </Link>

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Хариултуудыг хянах</h1>
              <p className="text-muted-foreground">{exam.title}</p>
            </div>
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Үр дүн татах PDF
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {currentQuestionIndex + 1}
                  </span>
                  <div>
                    <span className="px-2 py-1 rounded bg-secondary text-xs font-medium">
                      {currentQuestion.type}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentQuestion.marks} оноо
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Зөв</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">Буруу</span>
                    </>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6">
                {currentQuestion.question}
              </h2>

              {/* Multiple Choice */}
              {currentQuestion.type === "multiple-choice" &&
                currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isStudentAnswer = index === studentAnswer?.answer;
                      const isCorrectAnswer =
                        index === currentQuestion.correctAnswer;

                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 ${
                            isCorrectAnswer
                              ? "border-green-500 bg-green-50"
                              : isStudentAnswer && !isCorrectAnswer
                                ? "border-red-500 bg-red-50"
                                : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                                isCorrectAnswer
                                  ? "bg-green-500 text-white"
                                  : isStudentAnswer
                                    ? "bg-red-500 text-white"
                                    : "bg-secondary text-foreground"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1">{option}</span>
                            {isCorrectAnswer && (
                              <span className="text-sm font-medium text-green-700">
                                Зөв хариулт
                              </span>
                            )}
                            {isStudentAnswer && !isCorrectAnswer && (
                              <span className="text-sm font-medium text-red-700">
                                Таны хариулт
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              {/* True/False */}
              {currentQuestion.type === "true-false" && (
                <div className="grid grid-cols-2 gap-4 max-w-2xl">
                  {["true", "false"].map((value) => {
                    const isStudentAnswer = value === studentAnswer?.answer;
                    const isCorrectAnswer =
                      value === currentQuestion.correctAnswer;

                    return (
                      <div
                        key={value}
                        className={`p-6 rounded-lg border-2 ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-50"
                            : isStudentAnswer && !isCorrectAnswer
                              ? "border-red-500 bg-red-50"
                              : "border-border"
                        }`}
                      >
                        <p className="font-medium text-lg capitalize">
                          {value}
                        </p>
                        {isCorrectAnswer && (
                          <p className="text-sm text-green-700 mt-1">
                            Зөв хариулт
                          </p>
                        )}
                        {isStudentAnswer && !isCorrectAnswer && (
                          <p className="text-sm text-red-700 mt-1">
                            Таны хариулт
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Short Answer */}
              {currentQuestion.type === "short-answer" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Таны хариулт:
                    </p>
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                      }`}
                    >
                      <p>{studentAnswer?.answer}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Зөв хариулт:
                    </p>
                    <div className="p-4 rounded-lg border border-green-500 bg-green-50">
                      <p>{currentQuestion.correctAnswer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Өмнөх
              </Button>

              <span className="text-sm text-muted-foreground">
                {currentQuestionIndex + 1} / {questions.length}
              </span>

              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Дараах
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Question Navigator Sidebar */}
          <aside className="w-64 bg-white rounded-lg border border-border shadow-sm p-6 sticky top-8 h-fit">
            <h3 className="font-semibold mb-4">Асуултууд</h3>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {questions.map((q, index) => {
                const ans = attempt.answers.find((a) => a.questionId === q.id);
                const correct = ans?.isCorrect || false;

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                      index === currentQuestionIndex
                        ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                        : correct
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-100" />
                <span>Зөв</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-100" />
                <span>Буруу</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Таны оноо</p>
              <p className="text-2xl font-bold text-primary">
                {attempt.score}%
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
