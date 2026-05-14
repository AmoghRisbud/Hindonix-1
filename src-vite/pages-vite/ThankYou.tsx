import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Calendar, Home } from "lucide-react";

const ThankYou = () => {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 min-h-[80vh] flex items-center gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8 animate-scale-in">
              <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto animate-pulse-glow">
                <CheckCircle className="w-12 h-12 text-accent" />
              </div>
            </div>

            {/* Heading */}
            <h1
              className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Thank You for Reaching Out!
            </h1>

            {/* Message */}
            <p
              className="text-lg text-primary-foreground/80 mb-10 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              We've received your quote request and our team will review it
              promptly. Expect to hear from us within{" "}
              <span className="text-accent font-semibold">24 hours</span>.
            </p>

            {/* What's Next */}
            <div
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 mb-10 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <h2 className="font-heading text-xl font-semibold text-primary-foreground mb-4">
                What Happens Next?
              </h2>
              <div className="text-left space-y-4 text-primary-foreground/80">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent-foreground text-xs font-bold">
                      1
                    </span>
                  </div>
                  <p>
                    Our team reviews your requirements and prepares a tailored
                    response.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent-foreground text-xs font-bold">
                      2
                    </span>
                  </div>
                  <p>
                    A dedicated account manager will reach out to discuss your
                    needs in detail.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent-foreground text-xs font-bold">
                      3
                    </span>
                  </div>
                  <p>
                    We'll provide a comprehensive quote and recommended
                    solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Button variant="hero" size="xl" asChild>
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule a Discovery Call
                </a>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/" className="gap-2">
                  <Home className="w-5 h-5" />
                  Return Home
                </Link>
              </Button>
            </div>

            {/* Reference Number */}
            <p
              className="text-primary-foreground/60 text-sm mt-10 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              Reference: GT-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ThankYou;
