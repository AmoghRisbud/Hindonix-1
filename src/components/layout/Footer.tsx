import { Link } from "react-router-dom";
import { Phone, Mail, Linkedin, Instagram } from "lucide-react";

const footerTopLinks = [
  { name: "About", path: "/about" },
  { name: "Product Catalogue", path: "/products" },
  { name: "Case Studies", path: "/case-studies" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms & Conditions", path: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Top Links Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {footerTopLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-background/80 hover:text-background text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Center Content Section */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          {/* Logo */}
          <Link to="/" className="inline-block mb-4">
            <img
              src="/images/logo/Logo_Without_Name_cropped.PNG"
              alt="Hindonix Logo"
              className="h-16 w-auto mx-auto"
            />
          </Link>

          {/* Brand Name */}
          <h3 className="font-heading text-2xl font-semibold text-background tracking-wider">
            HINDONIX
          </h3>

          {/* Contact Info */}
          <div className="space-y-2">
            <p className="flex items-center justify-center gap-2 text-background/80 text-sm">
              <Phone className="w-4 h-4" />
              <a
                href="tel:+918850765050"
                className="hover:text-background transition-colors"
              >
                T: +91 8850765050
              </a>
            </p>
            <p className="flex items-center justify-center gap-2 text-background/80 text-sm">
              <Mail className="w-4 h-4" />
              <a
                href="mailto:info@hindonix.com"
                className="hover:text-background transition-colors"
              >
                E: info@hindonix.com
              </a>
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center hover:bg-background/30 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center hover:bg-background/30 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <p className="text-background/60 text-xs text-center max-w-4xl mx-auto leading-relaxed">
            Hindonix is a registered trademark of Hindonix Architectural
            Hardware. © 2026. Hindonix all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
