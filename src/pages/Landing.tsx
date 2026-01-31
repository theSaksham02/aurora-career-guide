import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Briefcase, Rocket, Sparkles, TrendingUp, Users, Zap, ArrowRight, Star, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Compass,
    title: "Career Exploration",
    description: "Discover roles aligned with your strengths and passions",
    color: "from-[#074C6B] to-[#5D93A9]",
  },
  {
    icon: Briefcase,
    title: "Application Tracking",
    description: "Organize and monitor all your job applications",
    color: "from-[#5D93A9] to-[#A1D1E5]",
  },
  {
    icon: Rocket,
    title: "Onboarding Support",
    description: "Smooth transition into your dream role",
    color: "from-[#0B2B3D] to-[#074C6B]",
  },
];

const stats = [
  { label: "Users Guided", value: "10K+", numValue: 10, icon: Users },
  { label: "Success Rate", value: "95%", numValue: 95, icon: TrendingUp },
  { label: "Career Paths", value: "50+", numValue: 50, icon: Compass },
  { label: "AI Responses", value: "24/7", numValue: 24, icon: Zap },
];

const testimonials = [
  { name: "Sarah M.", role: "Software Engineer", text: "AURORA helped me land my dream job at a top tech company!" },
  { name: "James K.", role: "Product Manager", text: "The AI guidance was incredibly personalized and insightful." },
  { name: "Emily R.", role: "Data Scientist", text: "Best career tool I've ever used. Highly recommend!" },
];

// Animated particles for hero
function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#A1D1E5]/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#5D93A9]/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#074C6B]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Floating geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 border-2 border-white/20 rounded-full animate-float-random"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
      
      {/* Sparkle effects */}
      {[...Array(8)].map((_, i) => (
        <Sparkles
          key={`sparkle-${i}`}
          className="absolute text-white/30 animate-twinkle"
          size={12 + (i % 3) * 4}
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 4) * 20}%`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

// Typing animation for hero text
function TypedText() {
  const words = ["Career Agent", "Growth Partner", "Success Guide", "Future Builder"];
  const [currentWord, setCurrentWord] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayed.length < word.length) {
          setDisplayed(word.slice(0, displayed.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(word.slice(0, displayed.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWord((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, currentWord]);

  return (
    <span className="text-[#A1D1E5]">
      {displayed}
      <span className="animate-blink">|</span>
    </span>
  );
}

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Enhanced with animations */}
      <section className="relative min-h-screen bg-hero-gradient flex items-center justify-center overflow-hidden">
        <HeroParticles />
        
        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5D93A9]/20 via-transparent to-transparent" />
        
        {/* Animated circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 border border-white/10 rounded-full animate-spin-slow" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 border border-white/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-5 sm:px-6 relative z-10 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in-down">
              <Sparkles className="w-4 h-4 text-[#A1D1E5]" />
              <span className="text-sm font-medium text-white/90">AI-Powered Career Intelligence</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 animate-fade-in-up tracking-tight leading-tight">
              Meet <span className="text-[#A1D1E5] animate-glow">AURORA</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white/90 mt-4 block">
                Your <TypedText />
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 animate-fade-in-up max-w-2xl mx-auto px-4" style={{ animationDelay: '0.2s' }}>
              Stage-aware AI guidance that adapts to every step of your career journey
            </p>
            
            <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center px-4" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                asChild 
                className="group w-full sm:w-auto text-lg sm:text-xl py-7 px-10 bg-white text-[#0B2B3D] hover:bg-[#A1D1E5] font-bold rounded-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(161,209,229,0.4)] transition-all duration-500 hover:scale-105"
              >
                <Link to="/dashboard" className="flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="w-full sm:w-auto text-lg sm:text-xl py-7 px-10 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm"
              >
                <Link to="/career-exploration">Explore Careers</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-white/60 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#A1D1E5]" />
                <span className="text-sm">Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#A1D1E5]" />
                <span className="text-sm">No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#A1D1E5]" />
                <span className="text-sm">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-scroll-down" />
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Grid - Enhanced */}
      <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A1D1E5]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#074C6B]/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-5 sm:px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#A1D1E5]/10 text-[#074C6B] text-sm font-semibold mb-4">
              FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              How AURORA <span className="text-gradient">Helps You</span>
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Intelligent career guidance tailored to your unique journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                to={index === 0 ? "/career-exploration" : index === 1 ? "/applications" : "/onboarding"}
                className="group relative p-8 lg:p-10 rounded-3xl bg-card border border-border/50 hover:border-[#5D93A9]/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <feature.icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-[#074C6B] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground lg:text-lg mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-[#5D93A9] font-medium group-hover:text-[#074C6B] transition-colors">
                  Learn more 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/30 to-background relative">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#074C6B]/10 text-[#074C6B] text-sm font-semibold mb-4">
              TRUSTED WORLDWIDE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Join <span className="text-gradient">Thousands</span> of Users
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Our growing community of career achievers
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative p-6 lg:p-8 rounded-3xl bg-card border border-border/50 hover:border-[#5D93A9]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#074C6B] to-[#5D93A9] mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm lg:text-base text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Stats Chart */}
          <div className="hidden sm:block max-w-3xl mx-auto h-64 lg:h-80 p-6 rounded-3xl bg-card border border-border/50 shadow-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="label" tick={{ fill: 'hsl(200, 30%, 40%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="numValue" radius={[12, 12, 0, 0]}>
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

      {/* Testimonials Section - New */}
      <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#A1D1E5]/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-5 sm:px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#A1D1E5]/10 text-[#074C6B] text-sm font-semibold mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Users <span className="text-gradient">Say</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="p-6 lg:p-8 rounded-3xl bg-card border border-border/50 hover:border-[#5D93A9]/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#A1D1E5] text-[#A1D1E5]" />
                  ))}
                </div>
                <p className="text-foreground mb-6 text-lg">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#074C6B] to-[#5D93A9] flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 lg:py-32 bg-hero-gradient relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#A1D1E5]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-5 sm:px-6 text-center relative z-10">
          <Sparkles className="w-12 h-12 text-[#A1D1E5] mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Transform<br />Your Career?
          </h2>
          <p className="text-lg lg:text-xl text-white/80 mb-10 max-w-xl mx-auto">
            Join thousands of professionals who've accelerated their career journey with AURORA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="group text-xl py-7 px-12 bg-white text-[#0B2B3D] hover:bg-[#A1D1E5] font-bold rounded-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] transition-all duration-500 hover:scale-105"
            >
              <Link to="/dashboard" className="flex items-center gap-2">
                Get Started Free
                <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="text-xl py-7 px-12 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white font-semibold rounded-2xl transition-all duration-300"
            >
              <Link to="/profile">View Profile</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
