import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";

export function CreateTrueFalse() {
  const navigate = useNavigate();
  const { examId } = useParams();
  
  const [question, setQuestion] = useState("");
  const [marks, setMarks] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("true");

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
          <h1 className="text-3xl font-bold mb-2">Create True/False Question</h1>
          <p className="text-muted-foreground">
            Add a binary choice question
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
                placeholder="3"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="max-w-xs"
                required
              />
            </div>

            <div>
              <Label className="mb-3">Correct Answer*</Label>
              <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="flex-1 cursor-pointer">True</Label>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="flex-1 cursor-pointer">False</Label>
                  </div>
                </div>
              </RadioGroup>
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
