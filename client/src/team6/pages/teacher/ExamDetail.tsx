import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Edit, Trash2, Plus, Eye, Send, Download, BarChart3 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { mockExams, mockQuestions } from "../../data/mockData";

export function ExamDetail() {
  const { examId } = useParams();
  const exam = mockExams.find(e => e.id === examId);
  const questions = mockQuestions.filter(q => q.examId === examId);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  if (!exam) return <div>Exam not found</div>;

  return (
    <div className="p-8">
      <Link 
        to="/team6/teacher/courses/1"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold">{exam.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                exam.status === 'published' 
                  ? 'bg-green-100 text-green-700'
                  : exam.status === 'draft'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {exam.status}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">{exam.description}</p>
            <p className="text-sm text-muted-foreground">
              Course: <span className="font-medium text-foreground">{exam.courseName}</span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to={`/team6/teacher/exams/${examId}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            {exam.status === 'draft' && (
              <Button onClick={() => setShowPublishDialog(true)}>
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            )}
            {exam.status === 'published' && (
              <Link to={`/team6/teacher/exams/${examId}/report`}>
                <Button>
                  <Eye className="w-4 h-4 mr-2" />
                  View Report
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 pt-6 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Duration</p>
            <p className="text-lg font-semibold">{exam.duration} minutes</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Marks</p>
            <p className="text-lg font-semibold">{exam.totalMarks}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Questions</p>
            <p className="text-lg font-semibold">{questions.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Start Time</p>
            <p className="text-lg font-semibold">
              {new Date(exam.startTime).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Randomize</p>
            <p className="text-lg font-semibold">{exam.randomizeQuestions ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
          <Link to={`/team6/teacher/exams/${examId}/questions/add`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </Link>
        </div>

        <div className="p-6">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No questions added yet</p>
              <Link to={`/team6/teacher/exams/${examId}/questions/add`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Question
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-3 flex-1">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium">
                            {question.type}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {question.marks} marks
                          </span>
                        </div>
                        <p className="font-medium mb-2">{question.question}</p>
                        {question.options && (
                          <div className="space-y-1">
                            {question.options.map((option, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  i === question.correctAnswer 
                                    ? 'bg-green-100 text-green-700 font-medium' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className={i === question.correctAnswer ? 'font-medium' : ''}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-3">
        <Link to={`/team6/teacher/exams/${examId}/variants`}>
          <Button variant="outline">Manage Variants</Button>
        </Link>
        {exam.status === 'published' && (
          <Link to="/team6/teacher/analytics">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
        )}
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
      </div>

      {/* Publish Confirmation Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish this exam? Students will be able to see and attempt it once published.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-secondary rounded-lg p-4 my-4">
            <p className="text-sm font-medium mb-2">Before publishing, make sure:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>All questions are added and reviewed</li>
              <li>Exam duration and marks are correct</li>
              <li>Start and end times are properly set</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowPublishDialog(false);
              // Handle publish
            }}>
              Publish Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}