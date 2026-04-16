import { Link, useParams } from "react-router";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { mockExams } from "../../data/mockData";

export function ExamsList() {
  const { courseId } = useParams();
  const exams = courseId ? mockExams.filter(e => e.courseId === courseId) : mockExams;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Бүх шалгалт</h1>
          <p className="text-muted-foreground">Шалгалтуудаа удирдаж, хянана уу</p>
        </div>
        <Link to={courseId ? `/team6/teacher/courses/${courseId}/exams/create` : "/team6/teacher/courses/1/exams/create"}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Шалгалт үүсгэх
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Шалгалт хайх..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Шүүлтүүр
          </Button>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid gap-4">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            to={`/team6/teacher/exams/${exam.id}`}
            className="bg-white rounded-lg border border-border shadow-sm p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{exam.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    exam.status === 'published' 
                      ? 'bg-green-100 text-green-700'
                      : exam.status === 'draft'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {exam.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{exam.courseName}</p>
                <p className="text-muted-foreground">{exam.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold">{exam.duration} мин</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Нийт оноо</p>
                <p className="font-semibold">{exam.totalMarks}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Асуулт</p>
                <p className="font-semibold">{exam.questionsCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Оролдсон</p>
                <p className="font-semibold">{exam.studentsAttempted}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Эхлэх цаг</p>
                <p className="font-semibold text-sm">
                  {new Date(exam.startTime).toLocaleDateString('mn-MN', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
