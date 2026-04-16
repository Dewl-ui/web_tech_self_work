import { Link, useParams } from "react-router";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/shared/EmptyState";

export function ExamVariants() {
  const { examId } = useParams();
  
  const variants = [
    { id: '1', name: 'Variant A', questionsCount: 25, studentsAssigned: 15 },
    { id: '2', name: 'Variant B', questionsCount: 25, studentsAssigned: 14 },
  ];

  return (
    <div className="p-8">
      <Link 
        to={`/team6/teacher/exams/${examId}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exam
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Exam Variants</h1>
          <p className="text-muted-foreground">
            Create different versions of the exam with varied questions
          </p>
        </div>
        <Link to={`/team6/teacher/exams/${examId}/variants/create`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Variant
          </Button>
        </Link>
      </div>

      {variants.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No variants created"
          description="Variants allow you to create different versions of the exam to prevent cheating"
          actionLabel="Create First Variant"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variants.map((variant) => (
            <Link
              key={variant.id}
              to={`/team6/teacher/exams/${examId}/variants/${variant.id}`}
              className="bg-white rounded-lg border border-border shadow-sm p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{variant.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Questions</p>
                  <p className="font-semibold">{variant.questionsCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Students</p>
                  <p className="font-semibold">{variant.studentsAssigned}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
