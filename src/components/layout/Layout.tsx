import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AuroraChat } from "@/components/aurora/AuroraChat";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E8F4F8] via-[#F0F7FA] to-[#E0EEF4]">
      <Navbar />
      <main className="flex-1 pt-24">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <AuroraChat />
    </div>
  );
}
