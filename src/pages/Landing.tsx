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
      <section className="relative min-h-screen bg-hero-gradient flex items-center justify-center overflow-hidden pt-20 sm:pt-0">
        {/* Animated Background Elements - Hidden on mobile for performance */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <div className="absolute top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 border border-white/10 rounded-full float-animation" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-40 right-10 sm:right-20 w-40 sm:w-56 h-40 sm:h-56 border border-white/10 rounded-full float-animation" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 left-1/4 w-28 sm:w-40 h-28 sm:h-40 border border-white/5 rounded-full float-animation" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-20 sm:w-24 h-20 sm:h-24 bg-white/5 rounded-full float-animation blur-xl" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/4 right-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-[#A1D1E5]/10 rounded-full float-animation blur-2xl" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up tracking-tight leading-tight">
              Meet <span className="text-[#A1D1E5]">AURORA</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white/90 mt-2 sm:mt-4 block">
                Your Career Agent
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mb-8 sm:mb-10 animate-fade-in-up max-w-2xl mx-auto px-4" style={{ animationDelay: '0.2s' }}>
              Stage-aware AI guidance for every career moment
            </p>
            <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center px-4" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                asChild 
                className="w-full sm:w-auto text-lg sm:text-xl py-6 sm:py-7 px-8 sm:px-12 bg-white text-[#0B2B3D] hover:bg-white/90 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/dashboard">Start Your Journey</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="w-full sm:w-auto text-lg sm:text-xl py-6 sm:py-7 px-8 sm:px-12 border-2 border-white/50 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-300"
              >
                <Link to="/career-exploration">Explore Careers</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-5 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground mb-3 sm:mb-4">
            How AURORA Helps You
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-center mb-10 sm:mb-16 max-w-2xl mx-auto px-4">
            Intelligent career guidance tailored to your unique journey
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 stagger-children">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-card border border-border/50 card-hover group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-[#5D93A9]/20 to-[#A1D1E5]/20 mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-[#074C6B]" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-muted/50">
        <div className="container mx-auto px-5 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground mb-3 sm:mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-center mb-10 sm:mb-16 max-w-2xl mx-auto px-4">
            Join our growing community of career achievers
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16 stagger-children">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-card border border-border/50 card-hover"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gradient mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Stats Chart - Hidden on small mobile */}
          <div className="hidden sm:block max-w-3xl mx-auto h-56 sm:h-64 lg:h-72 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border/50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="label" tick={{ fill: 'hsl(200, 30%, 40%)', fontSize: 11 }} axisLine={false} tickLine={false} />
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
      <section className="py-16 sm:py-20 lg:py-28 bg-hero-gradient relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 hidden sm:block">
          <div className="absolute top-10 right-10 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-36 sm:w-48 h-36 sm:h-48 bg-[#A1D1E5]/10 rounded-full blur-2xl" />
        </div>
        
        <div className="container mx-auto px-5 sm:px-6 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-8 sm:mb-10 max-w-xl mx-auto px-4">
            Join thousands of professionals who've accelerated their career with AURORA.
          </p>
          <Button 
            size="lg" 
            asChild 
            className="w-full sm:w-auto text-lg sm:text-xl py-6 sm:py-7 px-8 sm:px-12 bg-white text-[#0B2B3D] hover:bg-white/90 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 mx-4 sm:mx-0"
          >
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
