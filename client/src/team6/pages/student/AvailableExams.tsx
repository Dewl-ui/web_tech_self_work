import { Link } from "react-router";
import { Clock, FileText, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { mockExams } from "../../data/mockData";

export function AvailableExams() {
  const publishedExams = mockExams.filter((e) => e.status === "published");
  const completedExams = mockExams.filter((e) => e.status === "completed");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Миний шалгалт</h1>
        <p className="text-muted-foreground">Төлөвлөсөн шалгалтаа үзэх, өгөх</p>
      </div>

      {/* Available Exams */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Идэвхтэй Шалгалтууд</h2>
        <div className="grid gap-4">
          {publishedExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg border border-border shadow-sm p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{exam.title}</h3>
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                      Идэвхтэй
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {exam.courseName}
                  </p>
                  <p className="text-muted-foreground mb-4">
                    {exam.description}
                  </p>

                  <div className="grid grid-cols-4 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Өдөр</span>
                      </div>
                      <p className="font-semibold">
                        {new Date(exam.startTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Хугацаа</span>
                      </div>
                      <p className="font-semibold">{exam.duration} мин</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Оноо</span>
                      </div>
                      <p className="font-semibold">{exam.totalMarks}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Асуулт</span>
                      </div>
                      <p className="font-semibold">{exam.questionsCount}</p>
                    </div>
                  </div>
                </div>

                <Link to={`/team6/student/exams/${exam.id}/instructions`}>
                  <Button size="lg">Шалгалт өгөх</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Exams */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Дууссан Шалгалтууд</h2>
        <div className="grid gap-4">
          {completedExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg border border-border shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <h3 className="text-xl font-semibold">{exam.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {exam.courseName}
                  </p>

                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Оруулсан:</span>{" "}
                      <span className="font-medium">
                        {new Date(exam.endTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Оноо:</span>{" "}
                      <span className="font-bold text-green-600">92%</span>
                    </div>
                  </div>
                </div>

                <Link to={`/team6/student/exams/${exam.id}/result`}>
                  <Button variant="outline">Үр дүн</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
