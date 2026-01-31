import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Briefcase, Save, Settings, Bell, Shield, LogOut, ChevronRight } from "lucide-react";
import { mockUser, careerPaths } from "@/data/mockData";

// Glass card styles
const glassCard = "bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(11,43,61,0.1)]";
const glassCardDark = "bg-gradient-to-br from-[#0B2B3D] to-[#074C6B] backdrop-blur-xl border border-white/10";

const menuItems = [
  { icon: Settings, label: "Account Settings" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Privacy & Security" },
];

export default function Profile() {
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [stage, setStage] = useState<string>(mockUser.stage);

  const handleSave = () => {
    console.log("Saving profile:", { name, email, stage });
  };

  return (
    <div className="min-h-screen font-sf">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-[#0B2B3D] via-[#074C6B] to-[#0B2B3D] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#A1D1E5]/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              {name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge className="bg-white/20 text-white border-white/30 text-base px-4 py-1">{stage}</Badge>
                <span className="text-white/60">{email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-[#E8F4F8] via-[#F0F7FA] to-[#E0EEF4]">
        <div className="container mx-auto px-6 lg:px-10 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Sidebar Menu */}
            <div className="lg:col-span-4">
              <div className={`${glassCard} rounded-3xl p-6`}>
                <h3 className="font-bold text-[#0B2B3D] text-lg mb-4">Quick Menu</h3>
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#0B2B3D]/5 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A1D1E5]/30 to-[#5D93A9]/30 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-[#074C6B]" />
                      </div>
                      <span className="font-medium text-[#0B2B3D]">{item.label}</span>
                      <ChevronRight className="w-5 h-5 text-[#5D93A9] ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}

                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 transition-all text-left group mt-4 border-t border-[#0B2B3D]/10 pt-6">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-medium text-red-500">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-8 space-y-6">
              {/* Profile Form */}
              <div className={`${glassCard} rounded-3xl p-6 lg:p-8`}>
                <h3 className="text-xl font-bold text-[#0B2B3D] mb-6">Profile Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#0B2B3D] font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#5D93A9]" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-[#0B2B3D]/10 bg-white/50 focus:bg-white focus:border-[#5D93A9] text-[#0B2B3D]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#0B2B3D] font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#5D93A9]" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-[#0B2B3D]/10 bg-white/50 focus:bg-white focus:border-[#5D93A9] text-[#0B2B3D]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="stage" className="text-[#0B2B3D] font-medium">Career Stage</Label>
                    <Select value={stage} onValueChange={setStage}>
                      <SelectTrigger className="h-12 rounded-xl border-[#0B2B3D]/10 bg-white/50 focus:bg-white text-[#0B2B3D]">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-[#5D93A9]" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Intern">Intern / Job Seeker</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#0B2B3D]/10">
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] hover:opacity-90 text-white font-semibold text-base py-6 px-8 rounded-xl shadow-lg"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* Career Interests */}
              <div className={`${glassCard} rounded-3xl p-6 lg:p-8`}>
                <h3 className="text-xl font-bold text-[#0B2B3D] mb-6">Career Interests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerPaths.slice(0, 4).map((path, index) => (
                    <div
                      key={path.id}
                      className="p-5 rounded-2xl bg-[#0B2B3D]/5 hover:bg-[#0B2B3D]/10 transition-colors cursor-pointer border border-transparent hover:border-[#A1D1E5]/30"
                    >
                      <h4 className="font-semibold text-[#0B2B3D] mb-2">{path.title}</h4>
                      <p className="text-sm text-[#5D93A9] mb-3">{path.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {path.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs bg-white/50 border-[#A1D1E5]/50 text-[#074C6B]"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
