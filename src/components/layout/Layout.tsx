import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AuroraChat } from "@/components/aurora/AuroraChat";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <div className="min-h-screen flex flex-col bg-[#0B2B3D]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && !isChatPage && <Footer />}
      {!isChatPage && <AuroraChat />}
    </div>
  );
}
