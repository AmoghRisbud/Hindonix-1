import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Clock, Package, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const filters = ["All", "Export", "Import", "Logistics", "Consulting"];

const caseStudies = [
  {
    id: 1,
    title: "Scaling Hardware Exports to the Middle East",
    client: "European Tool Manufacturer",
    category: "Export",
    location: "Germany → UAE, Saudi Arabia",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
    problem:
      "A German tool manufacturer struggled to penetrate Middle Eastern markets due to complex regulations and lack of local distribution networks.",
    solution:
      "We established strategic partnerships with regional distributors, streamlined documentation processes, and set up efficient logistics routes.",
    outcome:
      "300% increase in Middle East sales within 18 months, with distribution now covering 8 countries.",
    stats: [
      { label: "Sales Increase", value: "300%" },
      { label: "Countries Covered", value: "8" },
      { label: "Time to Market", value: "-40%" },
    ],
  },
  {
    id: 2,
    title: "Optimizing Import Costs for Construction Supplies",
    client: "Santos Construction Group",
    category: "Import",
    location: "China → Brazil",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    problem:
      "High import duties and lengthy customs clearance were significantly impacting profit margins and project timelines.",
    solution:
      "Implemented duty optimization strategies, streamlined customs procedures, and established bonded warehouse solutions.",
    outcome:
      "Reduced import costs by 25% and cut average clearance time from 15 days to 5 days.",
    stats: [
      { label: "Cost Reduction", value: "25%" },
      { label: "Clearance Time", value: "5 days" },
      { label: "Annual Savings", value: "$2M" },
    ],
  },
  {
    id: 3,
    title: "Multi-Country Logistics Consolidation",
    client: "Pacific Tools Ltd",
    category: "Logistics",
    location: "Asia → Australia",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&h=400&fit=crop",
    problem:
      "Managing shipments from multiple Asian suppliers resulted in high freight costs and inventory management challenges.",
    solution:
      "Established a consolidation hub in Singapore, implemented inventory management systems, and optimized shipping routes.",
    outcome:
      "Reduced logistics costs by 35% and improved inventory turnover by 50%.",
    stats: [
      { label: "Freight Savings", value: "35%" },
      { label: "Inventory Turnover", value: "+50%" },
      { label: "Suppliers Managed", value: "25+" },
    ],
  },
  {
    id: 4,
    title: "Market Entry Strategy for Industrial Equipment",
    client: "Nordic Machinery Co",
    category: "Consulting",
    location: "Sweden → South Asia",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=400&fit=crop",
    problem:
      "Lacked market intelligence and local partnerships to enter the growing South Asian industrial equipment market.",
    solution:
      "Conducted comprehensive market research, identified key partners, and developed a phased market entry strategy.",
    outcome:
      "Successfully launched in 3 countries within 12 months, securing $5M in first-year orders.",
    stats: [
      { label: "First Year Orders", value: "$5M" },
      { label: "Markets Entered", value: "3" },
      { label: "Local Partners", value: "12" },
    ],
  },
  {
    id: 5,
    title: "Quality Control System Implementation",
    client: "EuroHardware GmbH",
    category: "Export",
    location: "China → Europe",
    image:
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop",
    problem:
      "Inconsistent product quality from Asian suppliers was causing returns and damaging brand reputation.",
    solution:
      "Implemented comprehensive QC protocols, established on-site inspection teams, and created supplier scorecards.",
    outcome:
      "Reduced defect rate from 8% to 0.5%, significantly improving customer satisfaction.",
    stats: [
      { label: "Defect Rate", value: "0.5%" },
      { label: "Customer Satisfaction", value: "98%" },
      { label: "Suppliers Audited", value: "50+" },
    ],
  },
  {
    id: 6,
    title: "Emergency Logistics Response",
    client: "Construction Consortium",
    category: "Logistics",
    location: "Multiple Origins → Qatar",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop",
    problem:
      "Critical equipment shortage threatened major project timeline with potential penalties of $100K per day.",
    solution:
      "Activated emergency logistics network, coordinated air freight from multiple origins, and expedited customs clearance.",
    outcome:
      "Delivered all equipment within 72 hours, saving the project from $2M in potential penalties.",
    stats: [
      { label: "Delivery Time", value: "72 hrs" },
      { label: "Penalties Saved", value: "$2M" },
      { label: "Sources Coordinated", value: "5" },
    ],
  },
];

const CaseStudies = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredCases = caseStudies.filter(
    (study) => activeFilter === "All" || study.category === activeFilter
  );

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Case Studies
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Success Stories That Inspire
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Explore how we've helped businesses overcome challenges and
              achieve their international trade goals.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Cases */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  activeFilter === filter
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/10"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Case Studies Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredCases.map((study) => (
              <div
                key={study.id}
                className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-accent/10 rounded-full text-xs font-medium text-accent">
                      {study.category}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      {study.location}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl lg:text-2xl font-bold text-foreground mb-2">
                    {study.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {study.client}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">
                        Challenge
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {study.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">
                        Solution
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {study.solution}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">
                        Outcome
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {study.outcome}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                    {study.stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-xl lg:text-2xl font-heading font-bold text-accent">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how GlobalTrade can help you achieve similar results
            for your business.
          </p>
          <Button variant="accent" size="xl" asChild>
            <Link to="/contact" className="gap-2">
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CaseStudies;
