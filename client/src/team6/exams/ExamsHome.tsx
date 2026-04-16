import { ClipboardList, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "../components/ui/button";

export function CourseExamsHome() {
  const { course_id } = useParams<{ course_id: string }>();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-0">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 mb-2">
                Exams
              </p>
              <h1 className="text-2xl font-bold text-slate-900">
                {course_id ? `Курс ${course_id} — Шалгалтууд` : "Шалгалтын жагсаалт"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Энд тухайн курсын шалгалтын жагсаалт харагдах болно. Одоогоор хоосон байна.
              </p>
            </div>
            <div className="hidden sm:flex">
              <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                <ClipboardList className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500 mb-4">
              Шалгалтын мэдээлэл хараахан нэмэгдээгүй байна.
            </p>
            <Link to={`/team6/courses/${course_id ?? ""}/exams/create`}>
              <Button>
                <Plus className="w-4 h-4" />
                Шалгалт үүсгэх
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseExamsHome;
