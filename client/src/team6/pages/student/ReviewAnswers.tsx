import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { mockExams, mockQuestions } from "../../data/mockData";

export function ReviewAnswers() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find((e) => e.id === examId);
  const questions = mockQuestions.filter((q) => q.examId === examId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Mock answers
  const answers: Record<string, any> = {
    q1: 1,
    q2: 1,
    q3: "false",
    q4: "BFS uses queue, DFS uses stack for traversal",
    q5: 2,
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleSubmit = () => {
    // Simulate submission and redirect to result
    navigate(`/team6/student/exams/${examId}/result`);
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

  if (!exam) return <div>Шалгалт олдсонгүй</div>;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-lg">Хариултуудыг шалгах</h1>
              <p className="text-sm text-muted-foreground">{exam.title}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Хариулсан</p>
                <p className="font-semibold">
                  {answeredCount}/{questions.length}
                </p>
              </div>
              <Button onClick={() => setShowSubmitDialog(true)} size="lg">
                Шалгалт илгээх
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
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
            <div className="bg-white rounded-lg border border-border shadow-sm p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
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
                {answers[currentQuestion.id] !== undefined ? (
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Хариулсан
                  </span>
                ) : (
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    Хариулаагүй
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-6">
                {currentQuestion.question}
              </h2>

              {/* Show answer based on type */}
              {currentQuestion.type === "multiple-choice" &&
                currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          answers[currentQuestion.id] === index
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                              answers[currentQuestion.id] === index
                                ? "bg-primary text-white"
                                : "bg-secondary text-foreground"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                          {answers[currentQuestion.id] === index && (
                            <span className="ml-auto text-sm font-medium text-primary">
                              Сонгосон
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {currentQuestion.type === "true-false" && (
                <div className="grid grid-cols-2 gap-4 max-w-2xl">
                  <div
                    className={`p-6 rounded-lg border-2 ${
                      answers[currentQuestion.id] === "true"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <p className="font-medium text-lg">True</p>
                    {answers[currentQuestion.id] === "true" && (
                      <p className="text-sm text-primary mt-1">Сонгосон</p>
                    )}
                  </div>
                  <div
                    className={`p-6 rounded-lg border-2 ${
                      answers[currentQuestion.id] === "false"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <p className="font-medium text-lg">False</p>
                    {answers[currentQuestion.id] === "false" && (
                      <p className="text-sm text-primary mt-1">Сонгосон</p>
                    )}
                  </div>
                </div>
              )}

              {currentQuestion.type === "short-answer" && (
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm text-muted-foreground mb-2">
                    Таны хариулт:
                  </p>
                  <p>{answers[currentQuestion.id] || "Хариулаагүй"}</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Өмнөх
              </Button>

              <Button onClick={() => setShowSubmitDialog(true)}>
                Шалгалт илгээх
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Дараах
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Question Navigator Sidebar */}
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-0 h-screen overflow-auto">
          <h3 className="font-semibold mb-4">Асуултын тойм</h3>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((q, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-primary text-white"
                    : answers[q.id] !== undefined
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100" />
              <span>Хариулсан ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-100" />
              <span>Хариулаагүй ({unansweredCount})</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Дуусгах</DialogTitle>
            <DialogDescription>
              Илгээсний дараа өөрчлөх боломжгүй. Та хариултаа шалгана уу.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
              <span>Нийт асуулт:</span>
              <span className="font-semibold">{questions.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
              <span>Хариулсан:</span>
              <span className="font-semibold text-green-700">
                {answeredCount}
              </span>
            </div>
            {unansweredCount > 0 && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
                <span>Хариулаагүй:</span>
                <span className="font-semibold text-red-700">
                  {unansweredCount}
                </span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Дахин шалгах
            </Button>
            <Button onClick={handleSubmit}>Баталгаажуулж & Илгээх</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
