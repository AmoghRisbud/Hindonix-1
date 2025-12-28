import { Link } from "react-router-dom";
import {
  Globe,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  company: [
    { name: "About Us", path: "/about" },
    { name: "Our Team", path: "/about#team" },
  ],
  services: [
    { name: "Export Management", path: "/services" },
    { name: "Import Consulting", path: "/services" },
    { name: "Logistics", path: "/services" },
    { name: "Documentation", path: "/services" },
  ],
  resources: [
    { name: "Case Studies", path: "/case-studies" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-heading text-2xl lg:text-3xl font-bold mb-2">
                Ready to Go Global?
              </h3>
              <p className="text-primary-foreground/70 max-w-md">
                Let's discuss how we can help you expand your business across
                borders.
              </p>
            </div>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <img
                src="/images/logo/Logo_Without_Name_cropped.PNG"
                alt="Hindonix Logo"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Precision-crafted architectural hardware. Elevating spaces with
              meticulously designed hardware solutions since 2025.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-accent" />
                <span>
                  182/1/A/1, Shiv samarth nagar, Opp.ST Depot, Tal.Khed,
                  Dis.Ratnagiri. 415709.
                </span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 text-accent" />
                <a
                  href="tel:+971501234567"
                  className="hover:text-accent transition-colors"
                >
                  +91 8850765050
                </a>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 text-accent" />
                <a
                  href="mailto:info@hindonix.com"
                  className="hover:text-accent transition-colors"
                >
                  info@hindonix.com
                </a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm text-center md:text-left">
              © 2025 Hindonix. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
