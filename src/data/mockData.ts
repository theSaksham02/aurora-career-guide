// Mock user data
export const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  stage: "Student" as const,
  applicationsInProgress: 5,
  nextMilestone: "Complete Resume Review",
  careerReadinessScore: 72,
};

// Application statuses
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn";

// Mock applications
export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  nextStep: string;
}

export const mockApplications: Application[] = [
  {
    id: "1",
    company: "Tech Innovations Inc",
    role: "Software Engineer Intern",
    status: "pending",
    appliedDate: "2024-01-15",
    nextStep: "Technical Interview - Jan 25",
  },
  {
    id: "2",
    company: "Data Solutions Co",
    role: "Data Analyst",
    status: "accepted",
    appliedDate: "2024-01-10",
    nextStep: "Start Date - Feb 1",
  },
  {
    id: "3",
    company: "Cloud Systems Ltd",
    role: "DevOps Intern",
    status: "rejected",
    appliedDate: "2024-01-05",
    nextStep: "Application closed",
  },
  {
    id: "4",
    company: "AI Ventures",
    role: "ML Engineer",
    status: "pending",
    appliedDate: "2024-01-18",
    nextStep: "Awaiting response",
  },
  {
    id: "5",
    company: "FinTech Global",
    role: "Backend Developer",
    status: "withdrawn",
    appliedDate: "2024-01-02",
    nextStep: "Withdrawn by applicant",
  },
  {
    id: "6",
    company: "StartupXYZ",
    role: "Full Stack Developer",
    status: "pending",
    appliedDate: "2024-01-20",
    nextStep: "HR Screening - Jan 28",
  },
];

// Career paths
export const careerPaths = [
  {
    id: "1",
    title: "Software Engineering",
    description: "Build applications and systems",
    skills: ["Programming", "Problem Solving", "System Design"],
  },
  {
    id: "2",
    title: "Data Science",
    description: "Analyze data and build ML models",
    skills: ["Statistics", "Python", "Machine Learning"],
  },
  {
    id: "3",
    title: "Product Management",
    description: "Lead product strategy and execution",
    skills: ["Communication", "Analytics", "Leadership"],
  },
  {
    id: "4",
    title: "UX Design",
    description: "Create user-centered experiences",
    skills: ["Design Thinking", "Prototyping", "Research"],
  },
  {
    id: "5",
    title: "DevOps Engineering",
    description: "Manage infrastructure and deployments",
    skills: ["Cloud", "Automation", "Linux"],
  },
];

// Stats data for charts
export const statsData = [
  { name: "Users", value: 10000 },
  { name: "Success Rate", value: 95 },
  { name: "Career Paths", value: 50 },
  { name: "Availability", value: 24 },
];

// Weekly progress data
export const weeklyProgressData = [
  { week: "Week 1", score: 45 },
  { week: "Week 2", score: 52 },
  { week: "Week 3", score: 58 },
  { week: "Week 4", score: 65 },
  { week: "Week 5", score: 68 },
  { week: "Week 6", score: 72 },
];

// Application timeline data
export const applicationTimelineData = [
  { date: "Jan 1", applications: 2 },
  { date: "Jan 8", applications: 5 },
  { date: "Jan 15", applications: 8 },
  { date: "Jan 22", applications: 10 },
  { date: "Jan 29", applications: 12 },
];

// Skills radar data
export const skillsRadarData = [
  { skill: "Technical Skills", value: 75, fullMark: 100 },
  { skill: "Soft Skills", value: 82, fullMark: 100 },
  { skill: "Industry Knowledge", value: 60, fullMark: 100 },
  { skill: "Experience Level", value: 45, fullMark: 100 },
  { skill: "Mindset Fit", value: 88, fullMark: 100 },
];

// Onboarding tasks
export const preOnboardingTasks = [
  { id: "1", label: "Review company handbook", completed: true },
  { id: "2", label: "Set up email", completed: true },
  { id: "3", label: "Connect with team", completed: false },
  { id: "4", label: "Prepare questions", completed: false },
];

export const firstWeekTasks = [
  { id: "5", label: "Attend orientation", completed: false },
  { id: "6", label: "Meet your manager", completed: false },
  { id: "7", label: "Complete training", completed: false },
  { id: "8", label: "Set goals", completed: false },
];
