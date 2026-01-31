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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic styles based on page and scroll
  const isDarkBg = isLandingPage && !scrolled;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4">
      <div className={`container mx-auto px-4 sm:px-6 rounded-2xl transition-all duration-500 ${
        isDarkBg 
          ? 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]' 
          : 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(11,43,61,0.15)]'
      }`}>
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2B3D] to-[#074C6B] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
              isDarkBg ? 'text-white' : 'text-[#0B2B3D]'
            }`}>
              AURORA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.href
                    ? isDarkBg 
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'bg-[#0B2B3D]/10 text-[#0B2B3D]'
                    : isDarkBg
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-[#5D93A9] hover:bg-[#0B2B3D]/5 hover:text-[#0B2B3D]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isLandingPage ? (
              <Button 
                asChild
                className={`rounded-xl px-5 py-2 font-semibold transition-all duration-300 ${
                  isDarkBg 
                    ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-[#0B2B3D] shadow-lg' 
                    : 'bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                <Link to="/dashboard">Get Started</Link>
              </Button>
            ) : (
              <Link to="/profile">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDarkBg 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-[#0B2B3D]/5 hover:bg-[#0B2B3D]/10 text-[#0B2B3D]'
                }`}>
                  <User className="h-5 w-5" />
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${
              isDarkBg 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-[#0B2B3D]/5 hover:bg-[#0B2B3D]/10 text-[#0B2B3D]'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-[0_8px_32px_rgba(11,43,61,0.15)] border border-white/50">
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
