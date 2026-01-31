import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, FileCheck, Users, Target } from "lucide-react";

const options = [
  {
    icon: Search,
    title: "Find Opportunities",
    description: "Discover internships and entry-level positions matching your profile",
    cta: "Search Jobs",
    href: "/applications",
  },
  {
    icon: FileCheck,
    title: "Optimize Your Resume",
    description: "Get AI-powered feedback to improve your application materials",
    cta: "Review Resume",
    href: "/profile",
  },
  {
    icon: Users,
    title: "Interview Preparation",
    description: "Practice with mock interviews and get personalized tips",
    cta: "Start Practice",
    href: "/quiz/interview",
  },
  {
    icon: Target,
    title: "Set Career Goals",
    description: "Define clear objectives and track your progress",
    cta: "Set Goals",
    href: "/dashboard",
  },
];

export default function InternPath() {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-hero text-foreground mb-4">Intern / Job Seeker</h1>
          <p className="text-subheading text-muted-foreground max-w-2xl mx-auto">
            Ready to land your next opportunity
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {options.map((option, index) => (
            <div
              key={option.title}
              className="p-8 bg-background rounded-lg border border-border hover:border-primary/30 transition-all hover:scale-[1.02] animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
                <option.icon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-3">{option.title}</h2>
              <p className="text-small text-muted-foreground mb-6">{option.description}</p>
              <Button variant="cta" asChild>
                <Link to={option.href}>{option.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h3 className="text-subheading text-foreground mb-4">Pro Tips</h3>
          <ul className="text-body text-muted-foreground space-y-2 text-left">
            <li>• Apply to 5-10 positions per week for best results</li>
            <li>• Customize your resume for each application</li>
            <li>• Follow up within 1-2 weeks of applying</li>
            <li>• Practice behavioral questions before interviews</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
