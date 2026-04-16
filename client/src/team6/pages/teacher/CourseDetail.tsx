import { Link, useParams } from "react-router";
import { ArrowLeft, Plus, Users, FileText, Calendar, BarChart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { mockCourses, mockExams } from "../../data/mockData";
import { StatsCard } from "../../components/shared/StatsCard";

export function CourseDetail() {
  const { courseId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);
  const courseExams = mockExams.filter(e => e.courseId === courseId);

  if (!course) return <div>Курс олдсонгүй</div>;

  return (
    <div className="p-8">
      <Link 
        to="/team6/teacher/courses"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Курс руу буцах
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {course.code}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm">
                {course.semester}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
            <p className="text-muted-foreground">
              Шалгалт, оюутан, агуулгаа эндээс удирдана.
            </p>
          </div>
          <Link to={`/team6/teacher/courses/${courseId}/exams/create`}>
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Шалгалт үүсгэх
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Оюутан</span>
            </div>
            <p className="text-2xl font-bold">{course.studentsCount}</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Шалгалт</span>
            </div>
            <p className="text-2xl font-bold">{course.examsCount}</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Идэвхтэй шалгалт</span>
            </div>
            <p className="text-2xl font-bold">
              {courseExams.filter(e => e.status === 'published').length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BarChart className="w-4 h-4" />
              <span className="text-sm">Дундаж оноо</span>
            </div>
            <p className="text-2xl font-bold">78.5%</p>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Шалгалтууд</h2>
          <Link to={`/team6/teacher/courses/${courseId}/exams`}>
            <Button variant="ghost" size="sm">Бүгдийг харах</Button>
          </Link>
        </div>

        <div className="p-6">
          {courseExams.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Шалгалт хараахан алга</h3>
              <p className="text-muted-foreground mb-4">
                Энэ курст эхний шалгалтаа үүсгэнэ үү.
              </p>
              <Link to={`/team6/teacher/courses/${courseId}/exams/create`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Шалгалт үүсгэх
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {courseExams.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/team6/teacher/exams/${exam.id}`}
                  className="block p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{exam.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          exam.status === 'published' 
                            ? 'bg-green-100 text-green-700'
                            : exam.status === 'draft'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {exam.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {exam.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{exam.duration} мин</span>
                        <span>•</span>
                        <span>{exam.totalMarks} оноо</span>
                        <span>•</span>
                        <span>{exam.questionsCount} асуулт</span>
                        <span>•</span>
                        <span>{exam.studentsAttempted} оролдлого</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
