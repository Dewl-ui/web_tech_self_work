import { Link } from "react-router";
import { BookOpen, FileText, Users, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { StatsCard } from "../../components/shared/StatsCard";
import { Button } from "../../components/ui/button";
import { mockExams, mockCourses } from "../../data/mockData";

export function TeacherDashboard() {
  const upcomingExams = mockExams.filter(e => e.status === 'published').slice(0, 3);
  const recentActivity = [
    { id: 1, action: 'Published', item: 'Midterm Exam - Trees and Graphs', time: '2 hours ago', course: 'CS201' },
    { id: 2, action: 'Graded', item: '42 submissions', time: '5 hours ago', course: 'CS201' },
    { id: 3, action: 'Created', item: 'Quiz 2 - Advanced SQL', time: '1 day ago', course: 'CS301' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Хяналтын самбар</h1>
        <p className="text-muted-foreground">Багаасаа тавтай морил, Dr. Sarah Miller</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Нийт курс"
          value={mockCourses.length}
          icon={BookOpen}
          trend={{ value: "Сүүлийн семестрээс +1", isPositive: true }}
        />
        <StatsCard
          title="Идэвхтэй шалгалт"
          value={mockExams.filter(e => e.status === 'published').length}
          icon={FileText}
          color="bg-green-500"
        />
        <StatsCard
          title="Нийт оюутан"
          value={mockCourses.reduce((acc, c) => acc + c.studentsCount, 0)}
          icon={Users}
          color="bg-purple-500"
        />
        <StatsCard
          title="Шалгах дүн"
          value={8}
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-border shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-semibold">Удахгүй эхлэх шалгалтууд</h2>
            <Link to="/team6/teacher/courses">
              <Button variant="ghost" size="sm">Бүгдийг харах</Button>
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <Link 
                  key={exam.id}
                  to={`/team6/teacher/exams/${exam.id}`}
                  className="block p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{exam.title}</h3>
                      <p className="text-sm text-muted-foreground">{exam.courseName}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {exam.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{exam.duration} мин</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{exam.questionsCount} асуулт</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{exam.studentsAttempted} оролдлого</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-primary font-medium">
                    {new Date(exam.startTime).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Сүүлийн үйлдлүүд</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>{" "}
                      {activity.item}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-secondary text-foreground">
                        {activity.course}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Түргэн үйлдлүүд</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/team6/teacher/courses/1/exams/create">
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Шалгалт үүсгэх
            </Button>
          </Link>
          <Link to="/team6/teacher/courses">
            <Button variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Курс удирдах
            </Button>
          </Link>
          <Link to="/team6/teacher/analytics">
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Шинжилгээ харах
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
