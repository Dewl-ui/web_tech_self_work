import { Link } from "react-router";
import { Plus, Users, FileText, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { mockCourses } from "../../data/mockData";

export function CourseList() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">Manage your courses and exams</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <Link
            key={course.id}
            to={`/team6/teacher/courses/${course.id}`}
            className="bg-white rounded-lg border border-border shadow-sm hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="h-32 bg-gradient-to-br from-primary to-blue-600 p-6 flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 text-white">
                <p className="text-sm font-medium opacity-90">{course.code}</p>
                <h3 className="font-semibold text-lg">{course.semester}</h3>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-lg mb-4">{course.name}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <div>
                    <p className="text-sm">Students</p>
                    <p className="font-semibold text-foreground">{course.studentsCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <div>
                    <p className="text-sm">Exams</p>
                    <p className="font-semibold text-foreground">{course.examsCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
