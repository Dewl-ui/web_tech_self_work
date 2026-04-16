import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Clock,
  FileText,
  AlertCircle,
  Maximize2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { mockExams } from "../../data/mockData";

export function ExamInstructions() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find((e) => e.id === examId);
  const [agreedToRules, setAgreedToRules] = useState(false);

  if (!exam) return <div>Exam not found</div>;

  const handleStartExam = () => {
    if (agreedToRules) {
      navigate(`/team6/student/exams/${examId}/take`);
    }
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
        {/* Exam Header */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
          <p className="text-muted-foreground mb-4">{exam.courseName}</p>
          <p className="text-foreground">{exam.description}</p>

          <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold text-lg">{exam.duration} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="font-semibold text-lg">{exam.totalMarks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="font-semibold text-lg">{exam.questionsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">Зааварчилгаа</h2>
          <div className="space-y-3 text-foreground">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                1
              </span>
              <p>Хариулахаасаа өмнө асуулт бүрийг анхааралтай уншина уу.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                2
              </span>
              <p>
                Та асуултын самбарыг ашиглан асуултуудын хооронд шилжиж болно.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                3
              </span>
              <p>Таны хариултууд 30 секунд тутамд автоматаар хадгалагдана.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                4
              </span>
              <p>Та хянаж үзэх асуултуудыг тэмдэглэж болно.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                5
              </span>
              <p>Шалгалтын хугацаа дуусахад шалгалт автоматаар илгээгдэнэ.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                6
              </span>
              <p>Тогтвортой интернет холболттой эсэхээ шалгаарай.</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600 shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">
                Анрааруулга
              </h3>
              <ul className="space-y-2 text-sm text-orange-800">
                <li>• Хөтчийг дахин ачаалах эсвэл хаах хэрэггүй</li>
                <li>• Таб солихыг хянаж болно</li>
                <li>• Copy-paste функц идэвхгүй</li>
                <li>• Хугацаанаас өмнө илгээх</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fullscreen Suggestion */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Maximize2 className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Tip:</span> Илүү сайн анхаарлаа
              төвлөрүүлэхийн тулд шалгалтыг бүтэн дэлгэцийн горимд өгөхийг
              зөвлөж байна.
            </p>
          </div>
        </div>

        {/* Agreement & Start */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-8">
          <div className="flex items-start gap-3 mb-6">
            <Checkbox
              id="agree"
              checked={agreedToRules}
              onCheckedChange={(checked) =>
                setAgreedToRules(checked as boolean)
              }
            />
            <label htmlFor="agree" className="text-sm cursor-pointer">
              Би бүх заавар, дүрмийг уншиж, ойлгосон.
            </label>
          </div>

          <div className="flex items-center justify-between">
            <Link to="/team6/student/exams">
              <Button variant="outline">Буцах</Button>
            </Link>
            <Button
              size="lg"
              onClick={handleStartExam}
              disabled={!agreedToRules}
            >
              Эхлэх
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
