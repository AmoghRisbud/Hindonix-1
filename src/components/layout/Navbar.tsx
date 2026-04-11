import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Blogs", path: "/blogs" },
  { name: "Get Catlogue", path: "/contact" },
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
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
              className={cn(
                "text-2xl tracking-[0.25em] transition-colors",
                "text-foreground",
              )}
            >
              H I N D O N I X<sup className="text-[10px] ml-0.5">®</sup>
            </span>
          </Link>

          {/* Desktop Navigation - Centered pill */}
          <div
            className={cn(
              "hidden lg:flex items-center gap-1 rounded-full px-2 py-1.5 transition-colors duration-300",
              "bg-black/[0.04]",
            )}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-5 py-2 rounded-full text-sm transition-all duration-200",
                  location.pathname === link.path
                    ? "text-foreground font-semibold"
                    : "text-foreground/60 hover:text-foreground",
                )}
              >
                {link.name}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                to="/admin"
                className={cn(
                  "px-5 py-2 rounded-full text-sm transition-all duration-200",
                  location.pathname === "/admin"
                    ? "text-foreground font-semibold"
                    : "text-foreground/60 hover:text-foreground",
                )}
              >
                Admin
              </Link>
            )}
            {!isSignedIn ? (
              <Link
                to="/login"
                className={cn(
                  "px-5 py-2 rounded-full text-sm transition-all duration-200",
                  location.pathname === "/login"
                    ? "text-foreground font-semibold"
                    : "text-foreground/60 hover:text-foreground",
                )}
              >
                Login
              </Link>
            ) : (
              <div className="px-3 py-1 flex items-center">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            )}
          </div>

          {/* Hamburger menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition-colors text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[500px] mt-4" : "max-h-0",
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
                    : "text-foreground hover:text-accent hover:bg-accent/5",
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
                    : "text-foreground hover:text-accent hover:bg-accent/5",
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
                    className="w-full !text-black hover:!text-black"
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
