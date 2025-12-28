import {
  Award,
  Clock,
  Handshake,
  Globe,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: Award,
    title: "10+ Years Expertise",
    description:
      "Decade of experience crafting premium architectural hardware for luxury projects.",
  },
  {
    icon: Globe,
    title: "UK & UAE Focus",
    description:
      "Dedicated service to UK and UAE markets with local understanding and support.",
  },
  {
    icon: Handshake,
    title: "B2B Partnership",
    description:
      "Tailored solutions for architects, designers, and construction professionals.",
  },
  {
    icon: Clock,
    title: "Responsive Service",
    description:
      "Quick quotes, sample availability, and dedicated support for all your hardware needs.",
  },
];

const stats = [
  { value: "200+", label: "Trade Partners", icon: Handshake },
  { value: "5,000+", label: "Projects Completed", icon: TrendingUp },
  { value: "99%", label: "Satisfaction Rate", icon: CheckCircle },
  { value: "11+", label: "Premium Finishes", icon: Globe },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Why Choose Us
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Craftsmanship Meets Design Excellence
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              We combine traditional craftsmanship with modern design to deliver
              architectural hardware that enhances every space with beauty,
              function, and lasting quality.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {reasons.map((reason, index) => (
                <div
                  key={reason.title}
                  className={cn("flex gap-4 opacity-0 animate-fade-in")}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <reason.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">
                      {reason.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Stats Grid */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl blur-xl" />

            <div className="relative bg-card rounded-3xl p-8 lg:p-10 shadow-card border border-border/50">
              <div className="text-center mb-10">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Our Impact in Numbers
                </h3>
                <p className="text-muted-foreground">
                  Measurable results that speak to our commitment
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "text-center p-6 rounded-2xl bg-secondary opacity-0 animate-scale-in"
                    )}
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                    <div className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative Element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
