import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, Target, Sparkles } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { skillsRadarData } from "@/data/mockData";

const branchingOptions = [
  {
    icon: HelpCircle,
    title: "I don't know what job to look for",
    description: "Take a quiz to discover careers that match your interests",
    cta: "Start Quiz",
    href: "/quiz/interests",
  },
  {
    icon: Target,
    title: "I know roughly what I want",
    description: "Let's refine your career path and set clear goals",
    cta: "Clarify Path",
    href: "/quiz/clarify",
  },
  {
    icon: Sparkles,
    title: "Let's discuss qualities I need",
    description: "Explore the skills and qualities for your target roles",
    cta: "Explore Skills",
    href: "/quiz/skills",
  },
];

export default function StudentPath() {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-hero text-foreground mb-4">Student Path</h1>
          <p className="text-subheading text-muted-foreground max-w-2xl mx-auto">
            Let's find the right direction for your career journey
          </p>
        </div>

        {/* Branching Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {branchingOptions.map((option, index) => (
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
              <Button variant="secondary" asChild className="w-full">
                <Link to={option.href}>{option.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Skills Radar Chart */}
        <div className="max-w-2xl mx-auto bg-background rounded-lg border border-border p-8">
          <h2 className="text-subheading text-foreground text-center mb-8">
            Skills Profile Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsRadarData}>
                <PolarGrid stroke="hsl(0, 0%, 90%)" />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: 'hsl(0, 0%, 40%)', fontSize: 11 }} 
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: 'hsl(0, 0%, 40%)', fontSize: 10 }} 
                />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="hsl(220, 100%, 32%)"
                  fill="hsl(220, 100%, 32%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-muted-foreground text-sm mt-4">
            Complete assessments to update your skills profile
          </p>
        </div>
      </div>
    </div>
  );
}
