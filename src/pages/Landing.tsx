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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 border border-white/10 rounded-full float-animation" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-40 right-20 w-56 h-56 border border-white/10 rounded-full float-animation" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 left-1/4 w-40 h-40 border border-white/5 rounded-full float-animation" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/5 rounded-full float-animation blur-xl" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#A1D1E5]/10 rounded-full float-animation blur-2xl" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up tracking-tight">
              Meet <span className="text-[#A1D1E5]">AURORA</span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-medium text-white/90 mt-2 block">
                Your Career Agent
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Stage-aware AI guidance for every career moment
            </p>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button variant="hero-solid" size="xl" asChild className="btn-premium">
                <Link to="/dashboard">Start Your Journey</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            How AURORA Helps You
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Intelligent career guidance tailored to your unique journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-2xl bg-card border border-border/50 card-hover group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5D93A9]/20 to-[#A1D1E5]/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-[#074C6B]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Join our growing community of career achievers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 stagger-children">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card border border-border/50 card-hover"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Stats Chart */}
          <div className="max-w-2xl mx-auto h-64 p-6 rounded-2xl bg-card border border-border/50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="label" tick={{ fill: 'hsl(200, 30%, 40%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="numValue" radius={[8, 8, 0, 0]}>
                  {stats.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? '#074C6B' : '#5D93A9'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-hero-gradient relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#A1D1E5]/10 rounded-full blur-2xl" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
            Join thousands of professionals who've accelerated their career with AURORA.
          </p>
          <Button variant="hero-solid" size="lg" asChild className="btn-premium">
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
