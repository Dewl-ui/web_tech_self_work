import { Link, useParams } from "react-router";
import { ArrowLeft, Edit, Trash2, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { mockQuestions } from "../../data/mockData";

export function VariantDetail() {
  const { examId, variantId } = useParams();
  const questions = mockQuestions.slice(0, 3); // Sample questions for variant

  return (
    <div className="p-8">
      <Link 
        to={`/team6/teacher/exams/${examId}/variants`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Variants
      </Link>

      {/* Variant Header */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Variant A</h1>
            <p className="text-muted-foreground">First variant of the exam</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Questions</p>
            <p className="text-2xl font-bold">{questions.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Students Assigned</p>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Questions in this Variant</h2>
        </div>
        <div className="p-6 space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium">
                      {question.type}
                    </span>
                    <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                  </div>
                  <p className="font-medium">{question.question}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Students */}
      <div className="mt-6 bg-white rounded-lg border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Students</h2>
        <Button variant="outline">
          <Users className="w-4 h-4 mr-2" />
          Manage Student Assignments
        </Button>
      </div>
    </div>
  );
}
