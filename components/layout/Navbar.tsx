"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Blogs", path: "/blogs" },
  { name: "Contact", path: "/contact" },
];

function NavbarContent({
  isSignedIn,
  showUserButton,
}: {
  isSignedIn: boolean;
  showUserButton: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo/cropped_updated_logo_with_name.PNG"
              alt="Hindonix Logo"
              className="h-20 w-auto transition-all group-hover:scale-105"
            />
            <span
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
              className="font-heading text-2xl tracking-wide transition-colors leading-none -translate-y-3"
            >
              H I N D O N I X<sup className="text-xs ml-0.5">®</sup>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                  pathname === link.path
                    ? "text-foreground bg-accent/10 font-semibold"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                href="/admin"
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                  pathname === "/admin"
                    ? "text-foreground bg-accent/10 font-semibold"
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
                  className="!text-black hover:!text-black"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button variant="accent" size="default" asChild>
                  <Link href="/contact">Get a Quote</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="accent" size="default" asChild>
                  <Link href="/contact">Get a Quote</Link>
                </Button>
                {showUserButton && (
                  <UserButton
                    appearance={{ elements: { avatarBox: "w-9 h-9" } }}
                  />
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors text-foreground"
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
                href={link.path}
                className={cn(
                  "block px-4 py-3 rounded-lg font-medium transition-colors",
                  pathname === link.path
                    ? "text-accent bg-accent/10"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                href="/admin"
                className={cn(
                  "block px-4 py-3 rounded-lg font-medium transition-colors",
                  pathname === "/admin"
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
                  <Button variant="outline" size="lg" className="w-full !text-black hover:!text-black" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button variant="accent" size="lg" className="w-full" asChild>
                    <Link href="/contact">Get a Quote</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="accent" size="lg" className="w-full" asChild>
                    <Link href="/contact">Get a Quote</Link>
                  </Button>
                  <div className="flex items-center justify-center pt-2">
                    {showUserButton && (
                      <UserButton
                        appearance={{ elements: { avatarBox: "w-10 h-10" } }}
                      />
                    )}
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

function NavbarWithClerk() {
  const { isSignedIn } = useAuth();
  return <NavbarContent isSignedIn={!!isSignedIn} showUserButton={true} />;
}

export function Navbar() {
  return <NavbarWithClerk />;
}
