import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, Award, BookOpen, Users } from "lucide-react";

const options = [
  {
    icon: Rocket,
    title: "Career Advancement",
    description: "Strategies to move up in your current organization or field",
    cta: "Plan Advancement",
    href: "/dashboard",
  },
  {
    icon: Award,
    title: "Skill Development",
    description: "Identify and develop skills for your next career milestone",
    cta: "Assess Skills",
    href: "/quiz/skills",
  },
  {
    icon: BookOpen,
    title: "Leadership Training",
    description: "Resources and guidance for leadership roles",
    cta: "Explore Leadership",
    href: "/onboarding",
  },
  {
    icon: Users,
    title: "Network Building",
    description: "Expand your professional network strategically",
    cta: "Build Network",
    href: "/profile",
  },
];

export default function ProfessionalPath() {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-hero text-foreground mb-4">Professional Growth</h1>
          <p className="text-subheading text-muted-foreground max-w-2xl mx-auto">
            Accelerate your career to the next level
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {options.map((option, index) => (
            <div
              key={option.title}
              className="p-8 bg-background rounded-lg border border-border hover:border-secondary/30 transition-all hover:scale-[1.02] animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 mb-6">
                <option.icon className="h-7 w-7 text-secondary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-3">{option.title}</h2>
              <p className="text-small text-muted-foreground mb-6">{option.description}</p>
              <Button variant="secondary" asChild>
                <Link to={option.href}>{option.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          <div>
            <div className="text-3xl font-bold text-primary">85%</div>
            <p className="text-sm text-muted-foreground">Promotion Rate</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary">2.5x</div>
            <p className="text-sm text-muted-foreground">Salary Growth</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">120+</div>
            <p className="text-sm text-muted-foreground">Leadership Roles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
