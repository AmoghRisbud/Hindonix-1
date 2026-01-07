import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Blogs", path: "/blogs" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo/cropped_updated_logo_with_name.PNG"
              alt="Hindonix Logo"
              className="h-20 w-auto transition-all group-hover:scale-105"
            />
            <span
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
              className={cn(
                "font-heading text-2xl tracking-wide transition-colors leading-none -translate-y-3",
                isScrolled ? "text-foreground" : "text-foreground"
              )}
            >
              H I N D O N I X<sup className="text-xs ml-0.5">®</sup>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                  location.pathname === link.path
                    ? isScrolled
                      ? "text-foreground bg-accent/10 font-semibold"
                      : "text-foreground bg-accent/10 font-semibold"
                    : isScrolled
                    ? "text-foreground hover:text-foreground hover:bg-accent/5"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                to="/admin"
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                  location.pathname === "/admin"
                    ? isScrolled
                      ? "text-foreground bg-accent/10 font-semibold"
                      : "text-foreground bg-accent/10 font-semibold"
                    : isScrolled
                    ? "text-foreground hover:text-foreground hover:bg-accent/5"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                )}
              >
                Admin
              </Link>
            )}
          </div>

          {/* CTA Button & Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {!isSignedIn ? (
              <>
                <Button
                  variant={isScrolled ? "outline" : "ghost"}
                  size="default"
                  asChild
                  className={cn(
                    !isScrolled &&
                      "text-white hover:bg-white/10 border-white/20"
                  )}
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="accent" size="default" asChild>
                  <Link to="/contact">Get a Quote</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="accent" size="default" asChild>
                  <Link to="/contact">Get a Quote</Link>
                </Button>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isScrolled ? "text-foreground" : "text-foreground"
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[500px] mt-4" : "max-h-0"
          )}
        >
          <div className="bg-card rounded-xl shadow-lg border border-border p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "block px-4 py-3 rounded-lg font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-accent bg-accent/10"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                to="/admin"
                className={cn(
                  "block px-4 py-3 rounded-lg font-medium transition-colors",
                  location.pathname === "/admin"
                    ? "text-accent bg-accent/10"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                )}
              >
                Admin
              </Link>
            )}
            <div className="pt-3 mt-3 border-t border-border space-y-2">
              {!isSignedIn ? (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="accent" size="lg" className="w-full" asChild>
                    <Link to="/contact">Get a Quote</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="accent" size="lg" className="w-full" asChild>
                    <Link to="/contact">Get a Quote</Link>
                  </Button>
                  <div className="flex items-center justify-center pt-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                        },
                      }}
                      afterSignOutUrl="/"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
