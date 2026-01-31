import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/career-exploration", label: "Explore" },
  { href: "/applications", label: "Applications" },
  { href: "/onboarding", label: "Onboarding" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  // Detect scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic styles based on page and scroll
  const isDarkBg = isLandingPage && !scrolled;
  const navBg = isDarkBg 
    ? "bg-[#0B2B3D]/90 backdrop-blur-md" 
    : "bg-white/95 backdrop-blur-md border-b border-border shadow-sm";
  const textColor = isDarkBg ? "text-white" : "text-[#0B2B3D]";
  const textMuted = isDarkBg ? "text-white/70" : "text-[#5D93A9]";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight ${textColor}`}>
              AURORA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-base font-medium transition-all duration-200 hover:scale-105 ${
                  location.pathname === link.href
                    ? `${textColor} font-semibold`
                    : `${textMuted} hover:${textColor}`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isLandingPage ? (
              <Button 
                variant={isDarkBg ? "outline" : "default"}
                size="lg"
                asChild
                className={isDarkBg 
                  ? "border-2 border-white text-white hover:bg-white hover:text-[#0B2B3D] font-semibold px-6" 
                  : "bg-[#0B2B3D] text-white hover:bg-[#074C6B] font-semibold px-6"
                }
              >
                <Link to="/dashboard">Get Started</Link>
              </Button>
            ) : (
              <Link to="/profile">
                <Button variant="ghost" size="icon" className={textColor}>
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 -mr-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`h-7 w-7 ${textColor}`} />
            ) : (
              <Menu className={`h-7 w-7 ${textColor}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-2 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-lg font-medium py-3 px-4 rounded-xl transition-colors ${
                    location.pathname === link.href
                      ? "bg-[#0B2B3D] text-white"
                      : "text-[#0B2B3D] hover:bg-gray-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2" />
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="lg" className="w-full text-lg py-6 border-2">
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Button>
              </Link>
              {isLandingPage && (
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button size="lg" className="w-full text-lg py-6 bg-[#0B2B3D] hover:bg-[#074C6B]">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
