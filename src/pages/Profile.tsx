import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Briefcase, Save, Camera, Check } from "lucide-react";
import { useUser, CareerStage } from "@/contexts/UserContext";
import { toast } from "sonner";

// Career interest options
const careerInterestOptions = [
  "Software Engineering",
  "Product Management",
  "Data Science",
  "UX Design",
  "Marketing",
  "Finance",
  "Consulting",
  "Healthcare",
  "Education",
  "Entrepreneurship",
];

export default function Profile() {
  const { profile, updateProfile } = useUser();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [stage, setStage] = useState<CareerStage>(profile.stage);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = () => {
    setHasChanges(true);
  };

  const handleSave = () => {
    updateProfile({ name, email, stage, interests });
    setHasChanges(false);
    toast.success("Profile saved successfully!");
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
    handleChange();
  };

  return (
    <div className="min-h-screen font-sf">
      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-br from-[#0B2B3D] via-[#074C6B] to-[#0B2B3D]">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">{stage}</Badge>
                <span className="text-white/60">{email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-10 max-w-3xl">
          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8">
            <h2 className="text-xl font-bold text-[#0B2B3D] mb-6">Profile Information</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-[#0B2B3D] font-medium">Full Name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5D93A9]" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); handleChange(); }}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5D93A9] text-[#0B2B3D]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-[#0B2B3D] font-medium">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5D93A9]" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); handleChange(); }}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5D93A9] text-[#0B2B3D]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stage" className="text-[#0B2B3D] font-medium">Career Stage</Label>
                <Select value={stage} onValueChange={(v) => { setStage(v as CareerStage); handleChange(); }}>
                  <SelectTrigger className="mt-2 h-12 rounded-xl border-gray-200 text-[#0B2B3D]">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-[#5D93A9]" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Intern">Intern / Job Seeker</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Career Interests */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8">
            <h2 className="text-xl font-bold text-[#0B2B3D] mb-2">Career Interests</h2>
            <p className="text-[#5D93A9] mb-6">Select the areas you're interested in</p>

            <div className="flex flex-wrap gap-3">
              {careerInterestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full border-2 transition-all ${interests.includes(interest)
                    ? 'bg-[#0B2B3D] text-white border-[#0B2B3D]'
                    : 'bg-white text-[#0B2B3D] border-gray-200 hover:border-[#5D93A9]'
                    }`}
                >
                  {interests.includes(interest) && <Check className="w-4 h-4 inline mr-1" />}
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-8 py-6 rounded-xl font-semibold text-lg transition-all ${hasChanges
                ? 'bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white hover:opacity-90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
