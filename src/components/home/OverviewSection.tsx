import { Package, Truck, Users, Globe, Factory, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const overviewCards = [
  {
    icon: Package,
    title: "Premium Products",
    description:
      "Quality hardware and industrial supplies sourced from certified global manufacturers.",
    stat: "10,000+",
    statLabel: "Products",
  },
  {
    icon: Truck,
    title: "Delivery Network",
    description:
      "Extensive logistics partnerships ensuring timely delivery to any destination worldwide.",
    stat: "98%",
    statLabel: "On-Time Delivery",
  },
  {
    icon: Users,
    title: "Trusted Clients",
    description:
      "Building lasting relationships with businesses across industries and continents.",
    stat: "500+",
    statLabel: "Happy Clients",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Operating across six continents with local expertise and global standards.",
    stat: "50+",
    statLabel: "Countries",
  },
];

export function OverviewSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            Why Global Businesses Choose Us
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Your Complete Import–Export Partner
          </h2>
          <p className="text-muted-foreground text-lg">
            From sourcing to delivery, we handle every aspect of international
            trade with precision, transparency, and unwavering commitment.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => (
            <div
              key={card.title}
              className={cn(
                "group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 hover:border-accent/30",
                "opacity-0 animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <card.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>

              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                {card.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                {card.description}
              </p>

              <div className="pt-4 border-t border-border">
                <div className="text-2xl font-heading font-bold text-accent">
                  {card.stat}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {card.statLabel}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Industry Focus */}
        <div className="mt-20 bg-card rounded-3xl p-8 lg:p-12 shadow-card border border-border/50">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
                Industry Expertise
              </span>
              <h3 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Specialized in Hardware & Industrial Products
              </h3>
              <p className="text-muted-foreground mb-6">
                With over 14 years of experience, we've developed deep expertise
                in sourcing, quality control, and logistics for hardware
                products and industrial supplies. Our specialized knowledge
                ensures your products meet international standards and reach
                their destination safely.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Hand Tools",
                  "Power Tools",
                  "Fasteners",
                  "Fittings",
                  "Valves",
                  "Machinery Parts",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary rounded-2xl p-6 text-center">
                <Factory className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-2xl font-heading font-bold text-foreground">
                  200+
                </div>
                <div className="text-sm text-muted-foreground">
                  Verified Suppliers
                </div>
              </div>
              <div className="bg-secondary rounded-2xl p-6 text-center">
                <Shield className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-2xl font-heading font-bold text-foreground">
                  100%
                </div>
                <div className="text-sm text-muted-foreground">
                  Quality Assured
                </div>
              </div>
              <div className="bg-primary rounded-2xl p-6 text-center col-span-2">
                <div className="text-xl font-heading font-bold text-primary-foreground mb-1">
                  Engineering & Industrial Supplies
                </div>
                <div className="text-sm text-primary-foreground/70">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
