import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, XCircle, Save, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { mockExams, mockExamAttempts, mockQuestions, mockStudents } from "../../data/mockData";
import { toast } from "sonner";

export function GradeExam() {
  const { examId, studentId } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find(e => e.id === examId);
  const attempt = mockExamAttempts.find(a => a.examId === examId && a.studentId === studentId);
  const student = mockStudents.find(s => s.id === studentId);
  const questions = mockQuestions.filter(q => q.examId === examId);

  // State for grading
  const [grades, setGrades] = useState<Record<string, { marks: number; feedback: string }>>(() => {
    const initialGrades: Record<string, { marks: number; feedback: string }> = {};
    questions.forEach(q => {
      const studentAnswer = attempt?.answers.find(a => a.questionId === q.id);
      // Auto-grade multiple choice and true-false
      if (q.type !== 'short-answer' && studentAnswer?.isCorrect !== undefined) {
        initialGrades[q.id] = {
          marks: studentAnswer.isCorrect ? q.marks : 0,
          feedback: studentAnswer.isCorrect ? 'Correct!' : 'Incorrect answer',
        };
      } else {
        initialGrades[q.id] = {
          marks: 0,
          feedback: '',
        };
      }
    });
    return initialGrades;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  if (!exam || !attempt || !student) return <div>Result not found</div>;

  const handleMarksChange = (questionId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const question = questions.find(q => q.id === questionId);
    if (question && numValue <= question.marks && numValue >= 0) {
      setGrades(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          marks: numValue,
        },
      }));
    }
  };

  const handleFeedbackChange = (questionId: string, value: string) => {
    setGrades(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        feedback: value,
      },
    }));
  };

  const handleSaveGrades = () => {
    const totalScore = Object.values(grades).reduce((sum, g) => sum + g.marks, 0);
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const percentage = (totalScore / totalMarks) * 100;

    console.log('Saving grades:', {
      examId,
      studentId,
      grades,
      totalScore,
      percentage,
    });

    toast.success('Үнэлгээ амжилттай хадгалагдлаа!');
    
    // Navigate to result detail page
    setTimeout(() => {
      navigate(`/team6/teacher/exams/${examId}/results/${studentId}`);
    }, 1000);
  };

  const getTotalScore = () => {
    return Object.values(grades).reduce((sum, g) => sum + g.marks, 0);
  };

  const getTotalPossibleMarks = () => {
    return questions.reduce((sum, q) => sum + q.marks, 0);
  };

  const getPercentage = () => {
    const total = getTotalPossibleMarks();
    return total > 0 ? ((getTotalScore() / total) * 100).toFixed(1) : 0;
  };

  const getGradedCount = () => {
    return questions.filter(q => {
      const grade = grades[q.id];
      return grade && (grade.marks > 0 || grade.feedback.length > 0);
    }).length;
  };

  const studentAnswer = attempt.answers.find(a => a.questionId === currentQuestion?.id);
  const isAutoGraded = currentQuestion?.type !== 'short-answer';

  return (
    <div className="p-8">
      <Link 
        to={`/team6/teacher/exams/${examId}/results`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Буцах
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Шалгалт үнэлэх</h1>
            <p className="text-muted-foreground mb-1">{exam.title}</p>
            <p className="text-sm text-muted-foreground">
              Оюутан: <span className="font-semibold text-foreground">{student.name}</span> ({student.studentId})
            </p>
          </div>
          <Button onClick={handleSaveGrades} size="lg">
            <Save className="w-4 h-4 mr-2" />
            Үнэлгээ хадгалах
          </Button>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Үнэлсэн асуулт</p>
            <p className="text-2xl font-bold text-primary">{getGradedCount()}/{questions.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Нийт оноо</p>
            <p className="text-2xl font-bold">{getTotalScore()}/{getTotalPossibleMarks()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Хувь</p>
            <p className="text-2xl font-bold text-green-600">{getPercentage()}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Үнэлгээ</p>
            <p className="text-2xl font-bold text-purple-600">
              {parseFloat(getPercentage() as string) >= 90 ? 'A' : 
               parseFloat(getPercentage() as string) >= 80 ? 'B' : 
               parseFloat(getPercentage() as string) >= 70 ? 'C' : 
               parseFloat(getPercentage() as string) >= 60 ? 'D' : 'F'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Асуулт {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                  {currentQuestionIndex + 1}
                </span>
                <div>
                  <span className="px-2 py-1 rounded bg-secondary text-xs font-medium">
                    {currentQuestion.type === 'multiple-choice' ? 'Олон сонголттой' : 
                     currentQuestion.type === 'true-false' ? 'Үнэн/Худал' : 'Богино хариулт'}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">{currentQuestion.marks} оноо</p>
                </div>
              </div>
              {isAutoGraded && (
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Автоматаар үнэлэгдсэн
                </span>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

            {/* Multiple Choice */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isStudentAnswer = index === studentAnswer?.answer;
                  const isCorrectAnswer = index === currentQuestion.correctAnswer;

                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrectAnswer 
                          ? 'border-green-500 bg-green-50'
                          : isStudentAnswer && !isCorrectAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                          isCorrectAnswer 
                            ? 'bg-green-500 text-white'
                            : isStudentAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-secondary text-foreground'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {isCorrectAnswer && (
                          <span className="text-sm font-medium text-green-700">Зөв хариулт</span>
                        )}
                        {isStudentAnswer && !isCorrectAnswer && (
                          <span className="text-sm font-medium text-red-700">Оюутны хариулт</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* True/False */}
            {currentQuestion.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-4 max-w-2xl mb-6">
                {['true', 'false'].map((value) => {
                  const isStudentAnswer = value === studentAnswer?.answer;
                  const isCorrectAnswer = value === currentQuestion.correctAnswer;

                  return (
                    <div 
                      key={value}
                      className={`p-6 rounded-lg border-2 ${
                        isCorrectAnswer 
                          ? 'border-green-500 bg-green-50'
                          : isStudentAnswer && !isCorrectAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-border'
                      }`}
                    >
                      <p className="font-medium text-lg capitalize">
                        {value === 'true' ? 'Үнэн' : 'Худал'}
                      </p>
                      {isCorrectAnswer && (
                        <p className="text-sm text-green-700 mt-1">Зөв хариулт</p>
                      )}
                      {isStudentAnswer && !isCorrectAnswer && (
                        <p className="text-sm text-red-700 mt-1">Оюутны хариулт</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Short Answer */}
            {currentQuestion.type === 'short-answer' && (
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Оюутны хариулт:</p>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="whitespace-pre-wrap">{studentAnswer?.answer || 'Хариулт өгөөгүй'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Жишээ хариулт:</p>
                  <div className="p-4 rounded-lg border border-green-500 bg-green-50">
                    <p className="whitespace-pre-wrap">{currentQuestion.correctAnswer}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Grading Section */}
            <div className="pt-6 border-t border-border space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Оноо <span className="text-muted-foreground">(Максимум: {currentQuestion.marks} оноо)</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  max={currentQuestion.marks}
                  step="0.5"
                  value={grades[currentQuestion.id]?.marks || 0}
                  onChange={(e) => handleMarksChange(currentQuestion.id, e.target.value)}
                  className="max-w-xs text-lg font-semibold"
                  disabled={isAutoGraded}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Санал хүсэлт / Тайлбар
                </label>
                <Textarea
                  value={grades[currentQuestion.id]?.feedback || ''}
                  onChange={(e) => handleFeedbackChange(currentQuestion.id, e.target.value)}
                  placeholder="Оюутанд зориулсан санал хүсэлт эсвэл тайлбар бичих..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Өмнөх асуулт
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} / {questions.length}
            </span>

            <Button 
              onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Дараах асуулт
            </Button>
          </div>
        </div>

        {/* Question Navigator Sidebar */}
        <aside className="w-80 bg-white rounded-lg border border-border shadow-sm p-6 sticky top-8 h-fit">
          <h3 className="font-semibold mb-4">Асуултын жагсаалт</h3>
          
          <div className="grid grid-cols-4 gap-2 mb-6">
            {questions.map((q, index) => {
              const grade = grades[q.id];
              const hasGrade = grade && (grade.marks > 0 || grade.feedback.length > 0);
              const isCorrect = q.type !== 'short-answer' && grade && grade.marks === q.marks;
              const isWrong = q.type !== 'short-answer' && grade && grade.marks === 0;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-16 h-16 rounded-lg font-medium text-sm transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : q.type === 'short-answer'
                      ? hasGrade
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-orange-100 text-orange-700'
                      : isCorrect
                      ? 'bg-green-100 text-green-700'
                      : isWrong
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  title={`${q.type === 'short-answer' ? 'Гараар үнэлэх' : 'Автомат үнэлгээ'}`}
                >
                  {index + 1}
                  {q.type === 'short-answer' && !hasGrade && (
                    <span className="block text-xs mt-1">✏️</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 text-sm mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100" />
              <span>Зөв</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-100" />
              <span>Буруу</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-100" />
              <span>Үнэлсэн</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-orange-100" />
              <span>Үнэлэх шаардлагатай</span>
            </div>
          </div>

          <div className="pt-6 border-t border-border space-y-3">
            <Button 
              onClick={handleSaveGrades} 
              className="w-full"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Үнэлгээ хадгалах
            </Button>
            <Link to={`/team6/teacher/exams/${examId}/results`} className="block">
              <Button variant="outline" className="w-full">
                Буцах
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
