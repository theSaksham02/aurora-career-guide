import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Play, ArrowRight, Quote, Star, Sparkles, 
  Rocket, Users, TrendingUp, Award, Zap,
  ChevronRight, MousePointer2
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Marquee phrases
const marqueeItems = [
  "Career Intelligence",
  "Personalized Guidance", 
  "Strategic Growth",
  "AI-Powered Insights",
  "Stage-Aware Support",
  "Career Transformation",
];

// Stats with images
const statsData = [
  { value: "95%", label: "Success Rate", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" },
  { value: "4.9", label: "User Rating", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
  { value: "50+", label: "Career Paths", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
  { value: "140%", label: "Career Growth", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop" },
];

// Testimonials
const testimonials = [
  { 
    quote: "AURORA completely transformed how I approach my career. The AI guidance felt like having a senior mentor available 24/7.",
    name: "Sarah Mitchell",
    role: "Software Engineer at Google",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop"
  },
  { 
    quote: "The stage-aware approach is brilliant. It knew exactly what I needed as a career changer and didn't waste my time.",
    name: "James Chen",
    role: "Product Manager at Meta",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  { 
    quote: "From confused student to confident professional in 6 months. AURORA made the impossible feel achievable.",
    name: "Emily Rodriguez",
    role: "Data Scientist at Netflix",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
];

// Infinite Marquee Component
function InfiniteMarquee({ direction = "left" }: { direction?: "left" | "right" }) {
  return (
    <div className="relative overflow-hidden py-6 bg-[#0B2B3D]">
      <div className={`flex whitespace-nowrap ${direction === "left" ? "animate-marquee" : "animate-marquee-reverse"}`}>
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="mx-8 text-4xl md:text-5xl lg:text-6xl font-bold text-white/20 hover:text-white/40 transition-colors cursor-default">
            {item}
            <span className="mx-8 text-[#A1D1E5]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Video Showreel Component
function VideoShowreel() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video thumbnail/placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B2B3D] via-[#074C6B] to-[#5D93A9]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200')] bg-cover bg-center opacity-30" />
      </div>
      
      {/* Animated overlay */}
      <div className={`absolute inset-0 bg-black/30 transition-opacity duration-500 ${isHovered ? 'opacity-50' : 'opacity-30'}`} />
      
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`relative transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          {/* Outer ring */}
          <div className={`absolute inset-0 rounded-full border-2 border-white/30 ${isHovered ? 'animate-ping' : ''}`} style={{ width: '140px', height: '140px', margin: '-20px' }} />
          
          {/* Play button */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-500">
            <Play className="w-10 h-10 md:w-12 md:h-12 text-[#0B2B3D] ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      
      {/* Label */}
      <div className="absolute bottom-8 left-8 text-white">
        <p className="text-sm font-medium text-white/60 mb-1">Watch our</p>
        <p className="text-2xl md:text-3xl font-bold">Showreel</p>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ stat, index }: { stat: typeof statsData[0], index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`group relative p-6 md:p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(11,43,61,0.08)] transition-all duration-700 hover:shadow-[0_20px_60px_rgba(11,43,61,0.15)] hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden mb-5 ring-4 ring-white shadow-lg group-hover:ring-[#A1D1E5] transition-all duration-300">
        <img src={stat.image} alt="" className="w-full h-full object-cover" />
      </div>
      
      {/* Value */}
      <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0B2B3D] mb-2 tracking-tight">
        {stat.value}
      </div>
      
      {/* Label */}
      <div className="text-lg md:text-xl text-[#5D93A9] font-medium">
        {stat.label}
      </div>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div 
      className="group p-8 md:p-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(11,43,61,0.08)] hover:shadow-[0_20px_60px_rgba(11,43,61,0.12)] transition-all duration-500"
    >
      {/* Quote icon */}
      <Quote className="w-12 h-12 text-[#A1D1E5] mb-6 -scale-x-100" fill="currentColor" />
      
      {/* Quote text */}
      <p className="text-xl md:text-2xl text-[#0B2B3D] font-medium leading-relaxed mb-8">
        "{testimonial.quote}"
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-[#A1D1E5]/30">
          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-bold text-[#0B2B3D] text-lg">{testimonial.name}</div>
          <div className="text-[#5D93A9]">{testimonial.role}</div>
        </div>
      </div>
      
      {/* Rating */}
      <div className="flex gap-1 mt-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-[#A1D1E5] fill-[#A1D1E5]" />
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="flex flex-col overflow-hidden font-sf">
      
      {/* Hero Section - Eloqwnt Style */}
      <section className="relative min-h-screen bg-gradient-to-b from-[#0B2B3D] via-[#074C6B] to-[#0B2B3D] flex flex-col justify-center pt-24 pb-12">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#A1D1E5]/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#5D93A9]/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Tagline */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-[2px] bg-[#A1D1E5]" />
              <span className="text-[#A1D1E5] text-lg font-medium tracking-wider uppercase">
                AI Career Intelligence
              </span>
            </div>
            
            {/* Main heading - Large Typography */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-[0.9] tracking-tight mb-8">
              We create
              <br />
              <span className="text-[#A1D1E5]">career solutions</span>
              <br />
              <span className="text-white/60">but most importantly</span>
              <br />
              we identify
              <br />
              <span className="italic font-light text-white/80">opportunities</span>
            </h1>
            
            {/* Subtext */}
            <p className="text-xl md:text-2xl text-white/60 max-w-2xl mb-12 leading-relaxed">
              AURORA is your AI-powered career agent that adapts to every stage of your professional journey—from student to executive.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                asChild 
                className="group text-lg md:text-xl py-7 px-10 bg-white text-[#0B2B3D] hover:bg-[#A1D1E5] font-bold rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(161,209,229,0.4)] transition-all duration-500 hover:scale-105"
              >
                <Link to="/dashboard" className="flex items-center gap-3">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="text-lg md:text-xl py-7 px-10 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white font-semibold rounded-full transition-all duration-300"
              >
                <Link to="/career-exploration" className="flex items-center gap-3">
                  Explore Careers
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40">
          <MousePointer2 className="w-5 h-5 animate-bounce" />
          <span className="text-sm font-medium tracking-wider">SCROLL</span>
        </div>
      </section>

      {/* Infinite Marquee */}
      <InfiniteMarquee direction="left" />

      {/* About Section */}
      <section className="py-24 lg:py-40 bg-gradient-to-b from-[#E8F4F8] to-white relative">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Text */}
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B2B3D]/5 text-[#074C6B] text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4" />
                  ABOUT AURORA
                </span>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B2B3D] leading-tight mb-8">
                  We are a
                  <br />
                  <span className="text-[#5D93A9]">stage-aware</span>
                  <br />
                  career intelligence
                  <br />
                  platform
                </h2>
                
                <p className="text-xl text-[#5D93A9] leading-relaxed mb-8">
                  AURORA meets you where you are. Whether you're a student exploring options, a job seeker optimizing applications, or a professional planning your next move—we provide personalized, actionable guidance.
                </p>
                
                <Link 
                  to="/onboarding" 
                  className="inline-flex items-center gap-3 text-[#0B2B3D] font-bold text-lg hover:text-[#074C6B] transition-colors group"
                >
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              
              {/* Right - Video */}
              <VideoShowreel />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 lg:py-40 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A1D1E5]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#074C6B]/5 rounded-full blur-[80px]" />
        
        <div className="container mx-auto px-6 lg:px-10 relative">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B2B3D]/5 text-[#074C6B] text-sm font-semibold mb-6">
                <TrendingUp className="w-4 h-4" />
                OUR IMPACT
              </span>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B2B3D] leading-tight">
                Results that
                <br />
                <span className="text-[#5D93A9]">speak for themselves</span>
              </h2>
            </div>
            
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee reverse */}
      <InfiniteMarquee direction="right" />

      {/* Features Section */}
      <section className="py-24 lg:py-40 bg-gradient-to-b from-[#0B2B3D] to-[#074C6B] relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-[#A1D1E5]/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-[#5D93A9]/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-10 relative">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#A1D1E5] text-sm font-semibold mb-6">
                <Zap className="w-4 h-4" />
                SERVICES
              </span>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                How AURORA
                <br />
                <span className="text-[#A1D1E5]">helps you succeed</span>
              </h2>
            </div>
            
            {/* Features grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: Users, 
                  title: "Career Exploration",
                  desc: "Discover roles aligned with your strengths, interests, and values through AI-powered matching.",
                  link: "/career-exploration"
                },
                { 
                  icon: Award, 
                  title: "Application Management",
                  desc: "Track, optimize, and supercharge your job applications with intelligent insights.",
                  link: "/applications"
                },
                { 
                  icon: Rocket, 
                  title: "Onboarding Support",
                  desc: "Nail your first 90 days with personalized onboarding guidance and success strategies.",
                  link: "/onboarding"
                },
              ].map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className="group p-8 md:p-10 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <feature.icon className="w-8 h-8 text-[#0B2B3D]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/60 text-lg leading-relaxed mb-6">{feature.desc}</p>
                  
                  <div className="flex items-center gap-2 text-[#A1D1E5] font-semibold group-hover:text-white transition-colors">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-40 bg-gradient-to-b from-white to-[#E8F4F8] relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10 relative">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B2B3D]/5 text-[#074C6B] text-sm font-semibold mb-6">
                <Quote className="w-4 h-4" />
                TESTIMONIALS
              </span>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B2B3D] leading-tight">
                What our users
                <br />
                <span className="text-[#5D93A9]">are saying</span>
              </h2>
            </div>
            
            {/* Testimonials grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.name} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 lg:py-40 bg-[#0B2B3D] relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#A1D1E5]/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-10 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Sparkles className="w-16 h-16 text-[#A1D1E5] mx-auto mb-8" />
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Ready to transform
              <br />
              <span className="text-[#A1D1E5]">your career?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto">
              Join thousands of professionals who've accelerated their career journey with AURORA's AI-powered guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild 
                className="group text-xl py-8 px-14 bg-white text-[#0B2B3D] hover:bg-[#A1D1E5] font-bold rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] transition-all duration-500 hover:scale-105"
              >
                <Link to="/dashboard" className="flex items-center gap-3">
                  Get Started Free
                  <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#A1D1E5] rounded-full" />
                <span className="text-sm font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#A1D1E5] rounded-full" />
                <span className="text-sm font-medium">Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#A1D1E5] rounded-full" />
                <span className="text-sm font-medium">AI-powered guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
