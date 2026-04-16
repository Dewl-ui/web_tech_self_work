import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  WifiOff,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { mockExams, mockQuestions } from "../../data/mockData";
import { Label } from "../../components/ui/label";

export function ExamTaking() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find((e) => e.id === examId);
  const questions = mockQuestions.filter((q) => q.examId === examId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(
    new Set(),
  );
  const [timeRemaining, setTimeRemaining] = useState(
    exam ? exam.duration * 60 : 0,
  );
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const currentQuestion = questions[currentQuestionIndex];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        // Show warning at 5 minutes
        if (prev === 300 && !showTimeWarning) {
          setShowTimeWarning(true);
          setTimeout(() => setShowTimeWarning(false), 5000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      setLastSaved(new Date());
      // Simulate auto-save
    }, 30000);

    return () => clearInterval(autoSave);
  }, [answers]);

  // Check internet connection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestionIndex)) {
      newMarked.delete(currentQuestionIndex);
    } else {
      newMarked.add(currentQuestionIndex);
    }
    setMarkedForReview(newMarked);
  };

  const handleSubmit = () => {
    navigate(`/team6/student/exams/${examId}/review-answers`);
  };

  const handleAutoSubmit = () => {
    // Auto-submit when time expires
    navigate(`/team6/student/exams/${examId}/result`);
  };

  if (!exam) return <div>Шалгалт олдсонгүй</div>;

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-lg">{exam.title}</h1>
              <p className="text-sm text-muted-foreground">{exam.courseName}</p>
            </div>

            <div className="flex items-center gap-6">
              {/* Auto-save indicator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>
                  Auto-saved{" "}
                  {Math.floor(
                    (new Date().getTime() - lastSaved.getTime()) / 1000,
                  )}
                  секундын өмнө
                </span>
              </div>

              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300
                    ? "bg-red-100 text-red-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-semibold text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Offline Warning */}
      {!isOnline && (
        <div className="bg-red-500 text-white px-6 py-3 flex items-center gap-3">
          <WifiOff className="w-5 h-5" />
          <p className="font-medium">
            Интернет холболт алга. Таны хариултууд локал хадгалагдах бөгөөд
            холболт сэргэсний дараа илгээгдэх болно.
          </p>
        </div>
      )}

      {/* Time Warning */}
      {showTimeWarning && (
        <div className="bg-orange-500 text-white px-6 py-3 flex items-center gap-3">
          <Clock className="w-5 h-5" />
          <p className="font-medium">
            5 минут үлдсэн байна! Хариултаа хянана уу.
          </p>
        </div>
      )}

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Асуулт {currentQuestionIndex + 1} / {questions.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} хариулсан, {unansweredCount} хариулаагүй
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
                <Button
                  variant={
                    markedForReview.has(currentQuestionIndex)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={handleMarkForReview}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  {markedForReview.has(currentQuestionIndex)
                    ? "Marked"
                    : "Mark for Review"}
                </Button>
              </div>

              <h2 className="text-xl font-semibold mb-6">
                {currentQuestion.question}
              </h2>

              {/* Multiple Choice */}
              {currentQuestion.type === "multiple-choice" &&
                currentQuestion.options && (
                  <RadioGroup
                    value={answers[currentQuestion.id]?.toString() || ""}
                    onValueChange={(value) => handleAnswer(parseInt(value))}
                  >
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                            answers[currentQuestion.id] === index
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleAnswer(index)}
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`option-${index}`}
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer flex items-center gap-3"
                          >
                            <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-medium">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

              {/* True/False */}
              {currentQuestion.type === "true-false" && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={handleAnswer}
                >
                  <div className="grid grid-cols-2 gap-4 max-w-2xl">
                    <div
                      className={`flex items-center gap-3 p-6 rounded-lg border-2 transition-colors cursor-pointer ${
                        answers[currentQuestion.id] === "true"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleAnswer("true")}
                    >
                      <RadioGroupItem value="true" id="true" />
                      <Label
                        htmlFor="true"
                        className="flex-1 cursor-pointer text-lg font-medium"
                      >
                        True
                      </Label>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-6 rounded-lg border-2 transition-colors cursor-pointer ${
                        answers[currentQuestion.id] === "false"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleAnswer("false")}
                    >
                      <RadioGroupItem value="false" id="false" />
                      <Label
                        htmlFor="false"
                        className="flex-1 cursor-pointer text-lg font-medium"
                      >
                        False
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              )}

              {/* Short Answer */}
              {currentQuestion.type === "short-answer" && (
                <Textarea
                  placeholder="Type your answer here..."
                  rows={8}
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="resize-none"
                />
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

              <Button
                onClick={() => setShowSubmitDialog(true)}
                variant="outline"
              >
                Шалгах ба илгээх
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
          <h3 className="font-semibold mb-4">Асуултын хөтөч</h3>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-primary text-white"
                    : answers[questions[index].id] !== undefined
                      ? "bg-green-100 text-green-700"
                      : markedForReview.has(index)
                        ? "bg-orange-100 text-orange-700"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
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
              <div className="w-6 h-6 rounded bg-secondary" />
              <span>Хариулаагүй ({unansweredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-orange-100" />
              <span>Шалгахад тэмдэглэсэн ({markedForReview.size})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary" />
              <span>Одоогийн асуулт</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Шалгалт илгээх</DialogTitle>
            <DialogDescription>
              Илгээхдээ итгэлтэй байна уу? Илгээсний дараа таны хариултуудыг
              өөрчлөх боломжгүй.
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
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
              <span>Хариулаагүй:</span>
              <span className="font-semibold text-red-700">
                {unansweredCount}
              </span>
            </div>
            {markedForReview.size > 0 && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50">
                <span>Шалгахад тэмдэглэсэн:</span>
                <span className="font-semibold text-orange-700">
                  {markedForReview.size}
                </span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Буцах
            </Button>
            <Button onClick={handleSubmit}>Шалгалт илгээх</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
