import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export function CreateVariant() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/team6/teacher/exams/${examId}/variants`);
  };

  return (
    <div className="p-8">
      <Link 
        to={`/team6/teacher/exams/${examId}/variants`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Variants
      </Link>

      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Exam Variant</h1>
          <p className="text-muted-foreground">
            Create a new variant with different question arrangement
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg border border-border shadow-sm p-8 space-y-6">
            <div>
              <Label htmlFor="name">Variant Name*</Label>
              <Input
                id="name"
                placeholder="e.g., Variant A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this variant..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="bg-accent rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Note:</p>
              <p className="text-sm text-muted-foreground">
                Variants help prevent cheating by randomly assigning different question versions to students.
                Questions will be automatically selected from the exam's question pool.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Link to={`/team6/teacher/exams/${examId}/variants`}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Create Variant</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
