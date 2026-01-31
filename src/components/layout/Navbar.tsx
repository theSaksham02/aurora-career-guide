import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/career-exploration", label: "Career Exploration" },
  { href: "/applications", label: "Applications" },
  { href: "/onboarding", label: "Onboarding" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isLandingPage ? "bg-transparent" : "bg-background/95 backdrop-blur-sm border-b border-border"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`text-xl font-bold ${isLandingPage ? "text-primary-foreground" : "text-primary"}`}>
              AURORA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:opacity-80 ${
                  location.pathname === link.href
                    ? isLandingPage ? "text-primary-foreground" : "text-primary"
                    : isLandingPage ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile & CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isLandingPage ? (
              <Button variant="hero-solid" asChild>
                <Link to="/dashboard">Get Started</Link>
              </Button>
            ) : (
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${isLandingPage ? "text-primary-foreground" : "text-foreground"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isLandingPage ? "text-primary-foreground" : "text-foreground"}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-4 bg-background rounded-lg p-4 shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium py-2 ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
