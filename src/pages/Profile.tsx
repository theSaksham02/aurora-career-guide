import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Briefcase, Save } from "lucide-react";
import { mockUser, careerPaths } from "@/data/mockData";

export default function Profile() {
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [stage, setStage] = useState<string>(mockUser.stage);

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log("Saving profile:", { name, email, stage });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-hero text-foreground mb-4">Profile</h1>
          <p className="text-body text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-background rounded-lg border border-border p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-subheading text-foreground">{name}</h2>
              <Badge variant="secondary" className="mt-2 bg-secondary text-secondary-foreground">{stage}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage" className="text-foreground">Career Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
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

          <div className="mt-8 pt-8 border-t border-border">
            <Button variant="cta" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Career Interests */}
        <div className="bg-background rounded-lg border border-border p-8">
          <h3 className="text-subheading text-foreground mb-6">Career Interests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerPaths.slice(0, 4).map((path) => (
              <div
                key={path.id}
                className="p-4 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <h4 className="font-semibold text-foreground mb-1">{path.title}</h4>
                <p className="text-small text-muted-foreground mb-3">{path.description}</p>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
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
  );
}
