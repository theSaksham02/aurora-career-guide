import { Link } from "react-router-dom";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="text-xl font-bold text-primary mb-2">AURORA</div>
            <p className="text-sm text-muted-foreground">
              Your intelligent career agent for every stage of your journey.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4 md:col-start-9">
            <div className="flex flex-wrap gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} AURORA Career Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
