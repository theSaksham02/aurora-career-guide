import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, Target, Sparkles, User, ArrowRight } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { skillsRadarData } from "@/data/mockData";

const branchingOptions = [
  {
    icon: HelpCircle,
    title: "I don't know what job to look for",
    description: "Take a quiz to discover careers that match your interests",
    cta: "Start Quiz",
    href: "/chat", // Directing to AI for personalized quiz
    gradient: "from-[#F59E0B] to-[#D97706]",
  },
  {
    icon: Target,
    title: "I know roughly what I want",
    description: "Let's refine your career path and set clear goals",
    cta: "Clarify Path",
    href: "/chat",
    gradient: "from-[#10B981] to-[#059669]",
  },
  {
    icon: Sparkles,
    title: "Let's discuss qualities I need",
    description: "Explore the skills and qualities for your target roles",
    cta: "Explore Skills",
    href: "/chat",
    gradient: "from-[#8B5CF6] to-[#7C3AED]",
  },
];

export default function StudentPath() {
  return (
    <div className="min-h-screen bg-subtle-gradient pb-20">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A1D1E5]/10 rounded-full blur-[100px] animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#A1D1E5] text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10 shadow-glow">
            <User className="w-4 h-4" />
            STUDENT PATHWAY
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Find Your <span className="text-gradient bg-gradient-to-r from-[#A1D1E5] to-[#5D93A9]">Direction</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Whether you're exploring or ready to commit, we have the tools to guide you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-10 relative z-20">

        {/* Branching Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 stagger-children">
          {branchingOptions.map((option, index) => (
            <div
              key={option.title}
              className="glass-card rounded-3xl p-8 card-hover relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${option.gradient}`} />

              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <option.icon className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-xl font-bold text-[#0B2B3D] mb-3">{option.title}</h2>
              <p className="text-[#5D93A9] mb-6 min-h-[48px]">{option.description}</p>

              <Button asChild className="w-full bg-[#074C6B] hover:bg-[#0B2B3D] text-white rounded-xl shadow-md transition-all group-hover:shadow-lg">
                <Link to={option.href} className="flex items-center justify-center gap-2">
                  {option.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Skills Radar Chart */}
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsRadarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: '#0B2B3D', fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#074C6B"
                    fill="#A1D1E5"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-[#0B2B3D] mb-4">
                Skills Profile Overview
              </h2>
              <p className="text-[#5D93A9] mb-6 leading-relaxed">
                Visualize your current strengths and identify areas for growth. Based on your recent interactions and assessments.
              </p>
              <div className="p-4 bg-white/50 rounded-xl border border-white/50 shadow-sm">
                <p className="text-sm text-[#074C6B] font-medium">
                  💡 Tip: Use the AI Chat to get specific resources for improving your "Technical" score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
