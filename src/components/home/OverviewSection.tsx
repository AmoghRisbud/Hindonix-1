import { Package, Truck, Users, Globe, Factory, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const overviewCards = [
  {
    icon: Package,
    title: "Premium Hardware",
    description:
      "Precision-crafted architectural hardware with exceptional quality and attention to detail.",
    stat: "1000+",
    statLabel: "Products",
  },
  {
    icon: Truck,
    title: "UK & UAE Delivery",
    description:
      "Reliable logistics ensuring timely delivery to UK and UAE markets with careful handling.",
    stat: "98%",
    statLabel: "On-Time Delivery",
  },
  {
    icon: Users,
    title: "B2B Partners",
    description:
      "Building lasting relationships with architects, designers, and construction professionals.",
    stat: "200+",
    statLabel: "Trade Partners",
  },
  {
    icon: Globe,
    title: "Premium Finishes",
    description:
      "Extensive range of finishes including PVD, brass, and premium metal options.",
    stat: "11+",
    statLabel: "Finish Options",
  },
];

export function OverviewSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            Why Design Professionals Choose Us
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Exceptional Architectural Hardware
          </h2>
          <p className="text-muted-foreground text-lg">
            From concept to installation, we provide premium hardware solutions
            with uncompromising quality, elegant design, and lasting durability.
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

      </div>
    </section>
  );
}
