import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { mockExams } from "../../data/mockData";

export function EditExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const exam = mockExams.find(e => e.id === examId);

  const [formData, setFormData] = useState({
    title: exam?.title || "",
    description: exam?.description || "",
    duration: exam?.duration?.toString() || "",
    totalMarks: exam?.totalMarks?.toString() || "",
    randomizeQuestions: exam?.randomizeQuestions || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/team6/teacher/exams/${examId}`);
  };

  if (!exam) return <div>Exam not found</div>;

  return (
    <div className="p-8">
      <Link 
        to={`/team6/teacher/exams/${examId}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exam
      </Link>

      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Exam</h1>
          <p className="text-muted-foreground">Update exam details and settings</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg border border-border shadow-sm p-8 space-y-6">
            <div>
              <Label htmlFor="title">Exam Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)*</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="totalMarks">Total Marks*</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium">Randomize Questions</p>
                <p className="text-sm text-muted-foreground">
                  Questions will appear in random order for each student
                </p>
              </div>
              <Switch
                checked={formData.randomizeQuestions}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, randomizeQuestions: checked })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Link to={`/team6/teacher/exams/${examId}`}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
