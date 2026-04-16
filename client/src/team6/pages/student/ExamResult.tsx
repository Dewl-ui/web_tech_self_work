import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Download,
  Eye,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { mockExams } from "../../data/mockData";
import { generateStudentResultPDF } from "../../utils/pdfGenerator";

export function ExamResult() {
  const { examId } = useParams();
  const exam = mockExams.find((e) => e.id === examId);

  // Mock result data
  const result = {
    score: 92,
    totalMarks: 100,
    percentage: 92,
    correctAnswers: 23,
    wrongAnswers: 2,
    totalQuestions: 25,
    timeTaken: "75 minutes",
    submittedAt: new Date().toISOString(),
    grade: "A",
  };

  if (!exam) return <div>Шалгалт олдсонгүй</div>;

  const handleDownloadPDF = () => {
    generateStudentResultPDF({
      studentName: "John Doe", // In real app, this would come from auth context
      examTitle: exam.title,
      courseName: exam.courseName,
      score: result.score,
      totalMarks: result.totalMarks,
      percentage: result.percentage,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
      totalQuestions: result.totalQuestions,
      timeTaken: result.timeTaken,
      submittedAt: new Date(result.submittedAt).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      grade: result.grade,
    });
  };

  return (
    <div>
      <Link
        to="/team6/student/exams"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Шалгалт руу буцах
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Success Banner */}
        <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-lg p-8 text-white text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Шалгалт амжилттай илгээгдсэн!
          </h1>
          <p className="text-green-100">
            Таны шалгалт илгээгдсэн бөгөөд үнэлгээ өгсөн байна.
          </p>
        </div>

        {/* Result Card */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{exam.title}</h2>
            <p className="text-muted-foreground">{exam.courseName}</p>
          </div>

          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-bold text-primary">
                {result.percentage}
              </span>
              <span className="text-3xl text-muted-foreground">%</span>
            </div>
            <p className="text-xl text-muted-foreground">
              {result.score} / {result.totalMarks} оноо
            </p>
            <div className="inline-block mt-4 px-6 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-lg">
              Grade: {result.grade}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {result.correctAnswers}
              </p>
              <p className="text-sm text-muted-foreground">Зөв</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {result.wrongAnswers}
              </p>
              <p className="text-sm text-muted-foreground">Буруу</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {result.timeTaken}
              </p>
              <p className="text-sm text-muted-foreground">
                Зарцуулсан хугацаа
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {result.totalQuestions}
              </p>
              <p className="text-sm text-muted-foreground">Асуултууд</p>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
          <h3 className="text-xl font-semibold mb-4">Гүйцэтгэлийн шинжилгээ</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Нарийвчлалын түвшин</span>
                <span className="text-sm font-semibold">
                  {(
                    (result.correctAnswers / result.totalQuestions) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(result.correctAnswers / result.totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Нийт оноо</span>
                <span className="text-sm font-semibold">
                  {result.percentage}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-8">
          <h3 className="text-xl font-semibold mb-4">Дараагийн алхамууд</h3>
          <div className="flex flex-wrap gap-3">
            <Link to={`/team6/student/exams/${examId}/review`}>
              <Button>
                <Eye className="w-4 h-4 mr-2" />
                Хариултуудыг хянах
              </Button>
            </Link>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Үр дүн татах PDF
            </Button>
            <Link to="/team6/student/exams">
              <Button variant="outline">Шалгалт руу буцах</Button>
            </Link>
          </div>
        </div>

        {/* Submission Details */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Submitted on{" "}
            {new Date(result.submittedAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
