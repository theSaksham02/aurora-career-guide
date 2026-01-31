import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Briefcase, Rocket } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const features = [
  {
    icon: Compass,
    title: "Career Exploration",
    description: "Discover roles aligned with your strengths",
  },
  {
    icon: Briefcase,
    title: "Application Management",
    description: "Organize and track your applications",
  },
  {
    icon: Rocket,
    title: "Onboarding Support",
    description: "Smooth transition into new roles",
  },
];

const stats = [
  { label: "Users Guided", value: "10K+", numValue: 10 },
  { label: "Success Rate", value: "95%", numValue: 95 },
  { label: "Career Paths", value: "50+", numValue: 50 },
  { label: "Availability", value: "24/7", numValue: 24 },
];

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-hero-gradient flex items-center justify-center overflow-hidden">
        {/* Geometric Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border-2 border-primary-foreground rounded-full" />
          <div className="absolute bottom-40 right-20 w-48 h-48 border-2 border-primary-foreground rotate-45" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 border-2 border-primary-foreground" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-hero text-primary-foreground mb-6 animate-fade-in">
              Meet AURORA, Your Career Agent
            </h1>
            <p className="text-subheading text-primary-foreground/90 mb-8 animate-fade-in">
              Stage-aware guidance for every career moment
            </p>
            <Button variant="cta" size="xl" asChild className="animate-slide-up">
              <Link to="/dashboard">Start Your Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-heading text-center text-foreground mb-12">
            How AURORA Helps You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-8 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-6">
                  <feature.icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-subheading text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-body text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <h2 className="text-heading text-center text-foreground mb-12">
            Trusted by Thousands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-hero text-primary mb-2">{stat.value}</div>
                <div className="text-small text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Stats Chart */}
          <div className="max-w-2xl mx-auto h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="label" tick={{ fill: 'hsl(0, 0%, 40%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="numValue" radius={[4, 4, 0, 0]}>
                  {stats.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? 'hsl(220, 100%, 32%)' : 'hsl(176, 100%, 33%)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-heading text-foreground mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of professionals who've accelerated their career with AURORA.
          </p>
          <Button variant="cta" size="lg" asChild>
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
