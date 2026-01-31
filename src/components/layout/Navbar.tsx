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
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 lg:p-6">
      {/* Floating Glassmorphism Container */}
      <div className="container mx-auto">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl lg:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-[#A1D1E5] to-[#5D93A9] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-[#0B2B3D] font-bold text-xl">A</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                AURORA
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-5 py-2.5 rounded-xl text-base font-medium transition-all duration-300 ${location.pathname === link.href
                      ? 'bg-white/20 text-white shadow-inner'
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
                  className="rounded-xl px-6 py-5 text-base font-semibold bg-white text-[#0B2B3D] hover:bg-[#A1D1E5] shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Link to="/dashboard">Get Started</Link>
                </Button>
              ) : (
                <Link to="/profile">
                  <div className="w-12 h-12 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 text-white border border-white/20">
                    <User className="h-5 w-5" />
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all duration-300"
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
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-3 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
              <div className="flex flex-col gap-2">
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
                    <Button size="lg" className="w-full text-lg py-6 bg-white text-[#0B2B3D] hover:bg-[#A1D1E5]">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
