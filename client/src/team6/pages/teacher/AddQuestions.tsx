import { Link, useParams } from "react-router";
import { ArrowLeft, FileQuestion, CheckCircle, FileText } from "lucide-react";

export function AddQuestions() {
  const { examId } = useParams();

  const questionTypes = [
    {
      type: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Questions with multiple options where students select one correct answer',
      icon: CheckCircle,
      path: `/team6/teacher/exams/${examId}/questions/multiple-choice`,
    },
    {
      type: 'true-false',
      title: 'True/False',
      description: 'Simple binary choice questions',
      icon: FileQuestion,
      path: `/team6/teacher/exams/${examId}/questions/true-false`,
    },
    {
      type: 'short-answer',
      title: 'Short Answer',
      description: 'Open-ended questions requiring text responses',
      icon: FileText,
      path: `/team6/teacher/exams/${examId}/questions/short-answer`,
    },
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

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Add Question</h1>
          <p className="text-muted-foreground">Select the type of question you want to create</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {questionTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.type}
                to={type.path}
                className="bg-white rounded-lg border-2 border-border p-8 hover:border-primary hover:shadow-lg transition-all text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
