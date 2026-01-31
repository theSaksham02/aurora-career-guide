import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Briefcase, TrendingUp } from "lucide-react";

const stages = [
  {
    icon: BookOpen,
    title: "Student",
    description: "Early stage / exploring",
    href: "/career-exploration/student",
  },
  {
    icon: Briefcase,
    title: "Intern / Job Seeker",
    description: "Looking for opportunities",
    href: "/career-exploration/intern",
  },
  {
    icon: TrendingUp,
    title: "Professional",
    description: "Career advancement",
    href: "/career-exploration/professional",
  },
];

export default function CareerExploration() {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-hero text-foreground mb-4">Career Exploration</h1>
          <p className="text-subheading text-muted-foreground max-w-2xl mx-auto">
            Select your current stage to get personalized guidance
          </p>
        </div>

        {/* Stage Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stages.map((stage, index) => (
            <div
              key={stage.title}
              className="text-center p-8 bg-background rounded-lg border border-border hover:border-primary/30 transition-all hover:scale-[1.02] animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <stage.icon className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-subheading text-foreground mb-3">{stage.title}</h2>
              <p className="text-body text-muted-foreground mb-6">{stage.description}</p>
              <Button variant="cta" asChild className="w-full">
                <Link to={stage.href}>Explore</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Not sure which stage fits you? AURORA can help you figure it out.
          </p>
        </div>
      </div>
    </div>
  );
}
