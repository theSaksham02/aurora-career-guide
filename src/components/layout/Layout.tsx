import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AuroraChat } from "@/components/aurora/AuroraChat";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <AuroraChat />
    </div>
  );
}
