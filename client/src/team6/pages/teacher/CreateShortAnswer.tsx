import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export function CreateShortAnswer() {
  const navigate = useNavigate();
  const { examId } = useParams();
  
  const [question, setQuestion] = useState("");
  const [marks, setMarks] = useState("");
  const [sampleAnswer, setSampleAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/team6/teacher/exams/${examId}`);
  };

  return (
    <div className="p-8">
      <Link 
        to={`/team6/teacher/exams/${examId}/questions/add`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Short Answer Question</h1>
          <p className="text-muted-foreground">
            Add an open-ended question requiring text response
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg border border-border shadow-sm p-8 space-y-6">
            <div>
              <Label htmlFor="question">Question*</Label>
              <Textarea
                id="question"
                placeholder="Enter your question here..."
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="marks">Marks*</Label>
              <Input
                id="marks"
                type="number"
                placeholder="10"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="max-w-xs"
                required
              />
            </div>

            <div>
              <Label htmlFor="sampleAnswer">Sample Answer (Optional)</Label>
              <Textarea
                id="sampleAnswer"
                placeholder="Provide a sample answer for reference during grading..."
                rows={6}
                value={sampleAnswer}
                onChange={(e) => setSampleAnswer(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-2">
                This will help you grade student responses consistently
              </p>
            </div>

            <div className="bg-accent rounded-lg p-4">
              <p className="text-sm font-medium mb-1">Note:</p>
              <p className="text-sm text-muted-foreground">
                Short answer questions require manual grading. Students will be able to type their responses in a text area.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Link to={`/team6/teacher/exams/${examId}`}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <div className="flex gap-3">
              <Button type="submit" variant="outline">Save & Add Another</Button>
              <Button type="submit">Save Question</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
