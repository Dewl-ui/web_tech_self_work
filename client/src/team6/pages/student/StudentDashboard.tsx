import { Link } from "react-router";
import { Clock, CheckCircle2, FileText, Calendar } from "lucide-react";
import { StatsCard } from "../../components/shared/StatsCard";
import { Button } from "../../components/ui/button";
import { mockExams } from "../../data/mockData";

export function StudentDashboard() {
  const upcomingExams = mockExams
    .filter((e) => e.status === "published")
    .slice(0, 3);
  const completedExams = 3;

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg p-8 text-white shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Тавтай морил, Бат!</h1>
        <p className="text-blue-100">
          Танд удахгүй болох {upcomingExams?.length ?? 0} шалгалт байна.
          Суралцахад тань амжилт хүсье!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Удахгүй болох шалгалт"
          value={upcomingExams.length}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatsCard
          title="Дууссан шалгалтууд"
          value={completedExams}
          icon={CheckCircle2}
          color="bg-green-500"
        />
        <StatsCard
          title="Дундаж оноо"
          value="85.3%"
          icon={FileText}
          color="bg-blue-500"
        />
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white rounded-lg border border-border shadow-sm mb-6">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Удахгүй болох шалгалт</h2>
          <Link to="/team6/student/exams">
            <Button variant="ghost" size="sm">
              Бүгдийн харах
            </Button>
          </Link>
        </div>

        <div className="p-6">
          {upcomingExams.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Одоогоор шалгалт байхгүй байна.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {exam.courseName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(exam.startTime).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{exam.duration} минут</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{exam.totalMarks} оноо</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/team6/student/exams/${exam.id}/instructions`}>
                      <Button>Дэлгэрэнгүй</Button>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm font-medium text-primary">
                      Starts:{" "}
                      {new Date(exam.startTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Идэвхтэй
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Өмнөх шалгалтууд</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Дууссан</span> асуулт хариулт 1
                  - SQL Үндсэн ойлголтууд
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  оноо: 92% • 2 хоногийн өмнө
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Дууссан</span> явцын шалгалт -
                  Мод ба графикууд
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  оноо: 85% • 5 хоногийн өмнө
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
