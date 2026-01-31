import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Briefcase, TrendingUp, Sparkles, ArrowRight, Compass } from "lucide-react";

const stages = [
  {
    icon: BookOpen,
    title: "Student",
    description: "Early stage career explorer. Get guidance on internships, skill-building, and discovering your path.",
    href: "/career-exploration/student",
    gradient: "from-[#A1D1E5] to-[#5D93A9]",
  },
  {
    icon: Briefcase,
    title: "Intern / Job Seeker",
    description: "Actively seeking opportunities. Optimize applications, prepare for interviews, and land your role.",
    href: "/career-exploration/intern",
    gradient: "from-[#5D93A9] to-[#074C6B]",
  },
  {
    icon: TrendingUp,
    title: "Professional",
    description: "Advancing your career. Navigate promotions, transitions, and leadership opportunities.",
    href: "/career-exploration/professional",
    gradient: "from-[#074C6B] to-[#0B2B3D]",
  },
];

// Glass card styles
const glassCard = "bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(11,43,61,0.1)]";

export default function CareerExploration() {
  return (
    <div className="min-h-screen font-sf">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-br from-[#0B2B3D] via-[#074C6B] to-[#0B2B3D] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#A1D1E5]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#5D93A9]/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#A1D1E5] text-sm font-semibold mb-6 backdrop-blur-sm">
              <Compass className="w-4 h-4" />
              CAREER EXPLORATION
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Discover Your
              <br />
              <span className="text-[#A1D1E5]">Career Path</span>
            </h1>

            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Select your current stage to receive personalized, stage-aware guidance from AURORA
            </p>
          </div>
        </div>
      </section>

      {/* Stage Selection Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-[#E8F4F8] via-[#F0F7FA] to-[#E0EEF4]">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="max-w-6xl mx-auto">
            {/* Stage Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stages.map((stage, index) => (
                <Link
                  to={stage.href}
                  key={stage.title}
                  className={`group ${glassCard} rounded-3xl p-8 lg:p-10 hover:shadow-[0_20px_60px_rgba(11,43,61,0.15)] transition-all duration-500 hover:-translate-y-2`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stage.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <stage.icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-[#0B2B3D] mb-3">{stage.title}</h2>
                  <p className="text-lg text-[#5D93A9] leading-relaxed mb-6">{stage.description}</p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-[#074C6B] font-semibold group-hover:text-[#0B2B3D] transition-colors">
                    Explore Path
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            {/* AI Help Section */}
            <div className={`mt-16 ${glassCard} rounded-3xl p-8 lg:p-12 text-center`}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-[#A1D1E5]" />
              </div>

              <h3 className="text-2xl font-bold text-[#0B2B3D] mb-4">Not Sure Which Stage Fits You?</h3>
              <p className="text-lg text-[#5D93A9] max-w-xl mx-auto mb-8">
                AURORA can help you identify where you are in your career journey and recommend the best path forward.
              </p>

              <Button
                asChild
                className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] hover:opacity-90 text-white font-semibold text-lg py-6 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Talk to AURORA
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
