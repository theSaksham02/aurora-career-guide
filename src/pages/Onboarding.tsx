import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { preOnboardingTasks, firstWeekTasks } from "@/data/mockData";

interface Task {
  id: string;
  label: string;
  completed: boolean;
}

const resources = [
  {
    icon: BookOpen,
    title: "Company Culture Guide",
    description: "Learn about values and expectations",
  },
  {
    icon: Users,
    title: "Team Directory",
    description: "Connect with your new colleagues",
  },
  {
    icon: GraduationCap,
    title: "Learning Resources",
    description: "Training materials and courses",
  },
];

export default function Onboarding() {
  const [preTasks, setPreTasks] = useState<Task[]>(preOnboardingTasks);
  const [weekTasks, setWeekTasks] = useState<Task[]>(firstWeekTasks);

  const allTasks = [...preTasks, ...weekTasks];
  const completedCount = allTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / allTasks.length) * 100);

  const toggleTask = (id: string, isPre: boolean) => {
    if (isPre) {
      setPreTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } else {
      setWeekTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-hero text-foreground mb-4">Onboarding</h1>
          <p className="text-body text-muted-foreground">
            Get ready for your new role with guided preparation
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-background rounded-lg border border-border p-8 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-subheading text-foreground">Overall Progress</h2>
            <span className="text-2xl font-bold text-secondary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-small text-muted-foreground mt-4">
            {completedCount} of {allTasks.length} tasks completed
          </p>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Pre-Onboarding */}
          <div className="bg-background rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Pre-Onboarding Tasks
            </h3>
            <div className="space-y-4">
              {preTasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id, true)}
                  />
                  <span
                    className={`text-body ${
                      task.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {task.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* First Week */}
          <div className="bg-background rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              First Week Tasks
            </h3>
            <div className="space-y-4">
              {weekTasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id, false)}
                  />
                  <span
                    className={`text-body ${
                      task.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {task.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div>
          <h2 className="text-subheading text-foreground mb-8">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div
                key={resource.title}
                className="bg-background rounded-lg border border-border p-6 hover:border-primary/30 transition-all hover:scale-[1.02] cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <resource.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                <p className="text-small text-muted-foreground">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
