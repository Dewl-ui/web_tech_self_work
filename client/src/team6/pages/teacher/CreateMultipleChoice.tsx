import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";

export function CreateMultipleChoice() {
  const navigate = useNavigate();
  const { examId } = useParams();
  
  const [question, setQuestion] = useState("");
  const [marks, setMarks] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("0");

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

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
          <h1 className="text-3xl font-bold mb-2">Create Multiple Choice Question</h1>
          <p className="text-muted-foreground">
            Add a question with multiple options
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
                placeholder="4"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="max-w-xs"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Options*</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddOption}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>

              <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <div className="flex-1 flex items-center gap-3">
                        <Label 
                          htmlFor={`option-${index}`}
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium"
                        >
                          {String.fromCharCode(65 + index)}
                        </Label>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                          }}
                          required
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOption(index)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground mt-2">
                Select the radio button next to the correct answer
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
