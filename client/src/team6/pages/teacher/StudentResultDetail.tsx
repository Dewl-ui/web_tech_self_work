import { Link, useParams } from "react-router";
import { ArrowLeft, CheckCircle2, XCircle, Download, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { mockExams, mockExamAttempts, mockQuestions, mockStudents } from "../../data/mockData";
import { generateStudentResultPDF } from "../../utils/pdfGenerator";

export function StudentResultDetail() {
  const { examId, studentId } = useParams();
  const exam = mockExams.find(e => e.id === examId);
  const attempt = mockExamAttempts.find(a => a.examId === examId && a.studentId === studentId);
  const student = mockStudents.find(s => s.id === studentId);
  const questions = mockQuestions.filter(q => q.examId === examId);

  if (!exam || !attempt || !student) return <div>Result not found</div>;

  const handleDownloadPDF = () => {
    // Prepare question data for PDF
    const questionData = questions.map((question) => {
      const studentAnswer = attempt.answers.find(a => a.questionId === question.id);
      
      return {
        question: question.question,
        type: question.type,
        marks: question.marks,
        studentAnswer: studentAnswer?.answer?.toString() || 'No answer',
        correctAnswer: question.correctAnswer?.toString() || '',
        isCorrect: studentAnswer?.isCorrect || false,
        options: question.options,
      };
    });

    const correctCount = attempt.answers.filter(a => a.isCorrect).length;
    const wrongCount = attempt.answers.filter(a => !a.isCorrect).length;

    generateStudentResultPDF({
      studentName: student.name,
      studentId: student.studentId,
      examTitle: exam.title,
      courseName: exam.courseName || 'Course',
      score: attempt.score,
      totalMarks: 100,
      percentage: attempt.score,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      totalQuestions: questions.length,
      timeTaken: '75 min',
      submittedAt: attempt.submittedAt,
      grade: attempt.score >= 90 ? 'A' : attempt.score >= 80 ? 'B' : attempt.score >= 70 ? 'C' : attempt.score >= 60 ? 'D' : 'F',
    }, questionData);
  };

  return (
    <div className="p-8">
      <Link 
        to={`/team6/teacher/exams/${examId}/results`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Results
      </Link>

      {/* Student Info & Score */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
            <p className="text-muted-foreground mb-1">Student ID: {student.studentId}</p>
            <p className="text-muted-foreground">{exam.title}</p>
          </div>
          <div className="flex gap-3">
            <Link to={`/team6/teacher/exams/${examId}/results/${studentId}/grade`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Grade Exam
              </Button>
            </Link>
            <Button onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 pt-6 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Score</p>
            <p className="text-3xl font-bold text-primary">{attempt.score}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Correct Answers</p>
            <p className="text-3xl font-bold text-green-600">
              {attempt.answers.filter(a => a.isCorrect).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Wrong Answers</p>
            <p className="text-3xl font-bold text-red-600">
              {attempt.answers.filter(a => !a.isCorrect).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Time Taken</p>
            <p className="text-3xl font-bold">75 min</p>
          </div>
        </div>
      </div>

      {/* Answers Review */}
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Answer Review</h2>
        </div>

        <div className="p-6 space-y-6">
          {questions.map((question, index) => {
            const studentAnswer = attempt.answers.find(a => a.questionId === question.id);
            const isCorrect = studentAnswer?.isCorrect || false;

            return (
              <div key={question.id} className="p-6 rounded-lg border border-border">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-semibold">Question {index + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium">
                        {question.type}
                      </span>
                      <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                    </div>

                    <p className="font-medium mb-4">{question.question}</p>

                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, i) => (
                          <div 
                            key={i} 
                            className={`p-3 rounded-lg border ${
                              i === question.correctAnswer 
                                ? 'border-green-500 bg-green-50' 
                                : i === studentAnswer?.answer
                                ? 'border-red-500 bg-red-50'
                                : 'border-border'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                i === question.correctAnswer 
                                  ? 'bg-green-500 text-white' 
                                  : i === studentAnswer?.answer
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span>{option}</span>
                              {i === question.correctAnswer && (
                                <span className="ml-auto text-xs font-medium text-green-700">Correct Answer</span>
                              )}
                              {i === studentAnswer?.answer && i !== question.correctAnswer && (
                                <span className="ml-auto text-xs font-medium text-red-700">Student's Answer</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div className="grid grid-cols-2 gap-3 mb-4 max-w-md">
                        <div className={`p-3 rounded-lg border ${
                          question.correctAnswer === 'true' 
                            ? 'border-green-500 bg-green-50' 
                            : studentAnswer?.answer === 'true'
                            ? 'border-red-500 bg-red-50'
                            : 'border-border'
                        }`}>
                          <p className="font-medium">True</p>
                          {question.correctAnswer === 'true' && (
                            <p className="text-xs text-green-700 mt-1">Correct Answer</p>
                          )}
                          {studentAnswer?.answer === 'true' && question.correctAnswer !== 'true' && (
                            <p className="text-xs text-red-700 mt-1">Student's Answer</p>
                          )}
                        </div>
                        <div className={`p-3 rounded-lg border ${
                          question.correctAnswer === 'false' 
                            ? 'border-green-500 bg-green-50' 
                            : studentAnswer?.answer === 'false'
                            ? 'border-red-500 bg-red-50'
                            : 'border-border'
                        }`}>
                          <p className="font-medium">False</p>
                          {question.correctAnswer === 'false' && (
                            <p className="text-xs text-green-700 mt-1">Correct Answer</p>
                          )}
                          {studentAnswer?.answer === 'false' && question.correctAnswer !== 'false' && (
                            <p className="text-xs text-red-700 mt-1">Student's Answer</p>
                          )}
                        </div>
                      </div>
                    )}

                    {question.type === 'short-answer' && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Student's Answer:</p>
                          <div className="p-3 rounded-lg bg-secondary">
                            <p>{studentAnswer?.answer}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Sample Answer:</p>
                          <div className="p-3 rounded-lg border border-green-500 bg-green-50">
                            <p>{question.correctAnswer}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}