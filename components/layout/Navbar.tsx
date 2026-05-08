"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Blogs", path: "/blogs" },
  { name: "Get Catalogue", path: "/contact" },
];

function NavbarContent({
  isSignedIn,
  showUserButton,
}: {
  isSignedIn: boolean;
  showUserButton: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── DESKTOP / TABLET TOP NAV ────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10 py-4 bg-[#eaeaea]/95 backdrop-blur-md">
        {/* Brand — left */}
        <Link
          href="/"
          className="shrink-0"
          aria-label="Hindonix home"
        >
          <span
            className="text-[#1a1a1a] text-lg leading-none tracking-[0.22em]"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            HINDONIX<sup className="text-[9px] ml-0.5">®</sup>
          </span>
        </Link>

        {/* Nav links — centre (hidden on small mobile) */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors tracking-wide",
                pathname === link.path
                  ? "bg-[#1a1a1a]/10 text-[#1a1a1a] font-semibold"
                  : "text-[#1a1a1a]/65 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/8"
              )}
            >
              {link.name}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/admin"
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors tracking-wide",
                pathname === "/admin"
                  ? "bg-[#1a1a1a]/10 text-[#1a1a1a] font-semibold"
                  : "text-[#1a1a1a]/65 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/8"
              )}
            >
              Admin
            </Link>
          )}
          {!isSignedIn ? (
            <Link
              href="/sign-in"
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors tracking-wide",
                "text-[#1a1a1a]/65 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/8"
              )}
            >
              Login
            </Link>
          ) : (
            showUserButton && (
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            )
          )}
        </div>

        {/* Hamburger — right */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#1a1a1a]"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* ── MOBILE / OVERFLOW DRAWER ────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-[#1a1a1a]/50" />
          <div
            className="absolute right-0 top-0 h-full w-64 bg-[#eaeaea] flex flex-col py-16 px-6 gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "block px-3 py-3 text-sm font-medium border-b border-[#1a1a1a]/10 tracking-widest uppercase",
                  pathname === link.path
                    ? "text-[#1a1a1a] font-semibold"
                    : "text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                href="/admin"
                className={cn(
                  "block px-3 py-3 text-sm font-medium border-b border-[#1a1a1a]/10 tracking-widest uppercase",
                  pathname === "/admin"
                    ? "text-[#1a1a1a] font-semibold"
                    : "text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                )}
              >
                Admin
              </Link>
            )}
            <div className="pt-4">
              {!isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="block px-3 py-3 text-sm font-medium tracking-widest uppercase text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                >
                  Login
                </Link>
              ) : (
                showUserButton && (
                  <div className="px-3 pt-2">
                    <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavbarWithClerk() {
  const { isSignedIn } = useAuth();
  return <NavbarContent isSignedIn={!!isSignedIn} showUserButton={true} />;
}

export function Navbar() {
  return <NavbarWithClerk />;
}
