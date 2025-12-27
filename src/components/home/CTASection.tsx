import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden gradient-hero">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-foreground rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Start Your Import/Export Journey With Us
              </h2>
              <p className="text-lg lg:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                Whether you're looking to expand into new markets or streamline
                your supply chain, our expert team is ready to guide you every
                step of the way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/contact" className="gap-2">
                    Request a Free Quote
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <a href="tel:+971501234567" className="gap-2">
                    <Phone className="w-5 h-5" />
                    Schedule a Call
                  </a>
                </Button>
              </div>

              {/* Quick Contact */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/80">
                <a
                  href="tel:+971501234567"
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Phone className="w-5 h-5 text-accent" />
                  <span>+971 50 123 4567</span>
                </a>
                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-primary-foreground/40" />
                <a
                  href="mailto:info@globaltrade.com"
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Mail className="w-5 h-5 text-accent" />
                  <span>info@globaltrade.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
