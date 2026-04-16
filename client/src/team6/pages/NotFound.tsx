import { Link } from "react-router";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/teacher/dashboard">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Teacher Dashboard
            </Button>
          </Link>
          <Link to="/student/dashboard">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Student Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
