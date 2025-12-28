import { Link } from "react-router-dom";
import { ArrowRight, Globe, Ship, Plane, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Precision-Crafted{" "}
              <span className="text-accent">Architectural Hardware</span>
            </h1>

            <p
              className="text-lg lg:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Elevating spaces with meticulously designed knobs, door handles,
              and pull handles. Where functionality meets timeless aesthetics.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact" className="gap-2">
                  Request a Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/products">View Collection</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div
              className="mt-12 pt-8 border-t border-primary-foreground/10 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <p className="text-primary-foreground/60 text-sm mb-4">
                Premium Finishes & Materials
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <div className="w-8 h-8 rounded bg-primary-foreground/10 flex items-center justify-center">
                    <span className="font-bold text-xs">PVD</span>
                  </div>
                  <span className="text-sm">PVD Finishes</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <div className="w-8 h-8 rounded bg-primary-foreground/10 flex items-center justify-center">
                    <span className="font-bold text-xs">B2B</span>
                  </div>
                  <span className="text-sm">Trade Only</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <div className="w-8 h-8 rounded bg-primary-foreground/10 flex items-center justify-center">
                    <span className="font-bold text-xs">UK</span>
                  </div>
                  <span className="text-sm">UK & UAE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-3xl blur-2xl" />

            <div className="relative grid grid-cols-2 gap-4">
              <div
                className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/10 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <Ship className="w-10 h-10 text-accent mb-4" />
                <div className="text-3xl font-heading font-bold text-primary-foreground mb-1">
                  50+
                </div>
                <p className="text-primary-foreground/70 text-sm">
                  Countries Served
                </p>
              </div>

              <div
                className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/10 animate-fade-in mt-8"
                style={{ animationDelay: "0.4s" }}
              >
                <Plane className="w-10 h-10 text-accent mb-4" />
                <div className="text-3xl font-heading font-bold text-primary-foreground mb-1">
                  15K+
                </div>
                <p className="text-primary-foreground/70 text-sm">
                  Shipments/Year
                </p>
              </div>

              <div
                className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/10 animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <Globe className="w-10 h-10 text-accent mb-4" />
                <div className="text-3xl font-heading font-bold text-primary-foreground mb-1">
                  500+
                </div>
                <p className="text-primary-foreground/70 text-sm">
                  Global Partners
                </p>
              </div>

              <div
                className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/10 animate-fade-in mt-8"
                style={{ animationDelay: "0.6s" }}
              >
                <TrendingUp className="w-10 h-10 text-accent mb-4" />
                <div className="text-3xl font-heading font-bold text-primary-foreground mb-1">
                  14+
                </div>
                <p className="text-primary-foreground/70 text-sm">
                  Years Experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
