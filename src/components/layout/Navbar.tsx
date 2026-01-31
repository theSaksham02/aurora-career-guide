import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/career-exploration", label: "Explore" },
  { href: "/applications", label: "Applications" },
  { href: "/onboarding", label: "Onboarding" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-white/30">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              AURORA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${location.pathname === link.href
                    ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
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
                className="rounded-xl px-6 py-2.5 font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-[#0B2B3D] shadow-lg transition-all duration-300"
              >
                <Link to="/dashboard">Get Started</Link>
              </Button>
            ) : (
              <Link to="/profile">
                <div className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 text-white border border-white/20">
                  <User className="h-5 w-5" />
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
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
            <div className="flex flex-col gap-2 bg-[#0B2B3D]/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-lg font-medium py-3 px-4 rounded-xl transition-colors ${location.pathname === link.href
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 my-2" />
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="lg" className="w-full text-lg py-6 border-white/30 text-white hover:bg-white/10">
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Button>
              </Link>
              {isLandingPage && (
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button size="lg" className="w-full text-lg py-6 bg-white text-[#0B2B3D] hover:bg-white/90">
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
