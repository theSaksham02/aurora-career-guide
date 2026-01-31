import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { UserProvider } from "@/contexts/UserContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CareerExploration from "./pages/CareerExploration";
import StudentPath from "./pages/StudentPath";
import InternPath from "./pages/InternPath";
import ProfessionalPath from "./pages/ProfessionalPath";
import Applications from "./pages/Applications";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import RoadmapPage from "./pages/RoadmapPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/career-exploration" element={<CareerExploration />} />
              <Route path="/career-exploration/student" element={<StudentPath />} />
              <Route path="/career-exploration/intern" element={<InternPath />} />
              <Route path="/career-exploration/professional" element={<ProfessionalPath />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
