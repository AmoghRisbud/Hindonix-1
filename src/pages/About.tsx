import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Globe,
  Handshake,
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description:
      "Transparent dealings and honest communication in every transaction.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Uncompromising quality standards in products and services.",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "Building long-term relationships based on mutual success.",
  },
  {
    icon: Heart,
    title: "Commitment",
    description: "Dedicated to exceeding expectations and delivering results.",
  },
];

const team = [
  {
    name: "Mohammed Al-Hassan",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    bio: "20+ years in international trade. Visionary leader driving global expansion.",
  },
  {
    name: "Sarah Mitchell",
    role: "Chief Operations Officer",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    bio: "Supply chain expert with expertise in logistics optimization.",
  },
  {
    name: "David Park",
    role: "Head of Business Development",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Strategic partnerships specialist expanding our global network.",
  },
];

const certifications = [
  { name: "ISO 9001:2015", description: "Quality Management" },
  { name: "ISO 14001", description: "Environmental Management" },
  { name: "AEO Certified", description: "Authorized Economic Operator" },
  { name: "FIATA Member", description: "International Freight Association" },
];

const About = () => {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              About Us
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Your Trusted Partner in Global Trade
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Since 2010, GlobalTrade has been connecting businesses across
              continents, delivering excellence in import-export solutions with
              integrity and expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-secondary rounded-3xl p-8 lg:p-10">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To be the world's most trusted import-export partner, enabling
                businesses of all sizes to thrive in global markets through
                seamless trade solutions and unwavering commitment to
                excellence.
              </p>
            </div>

            <div className="bg-primary rounded-3xl p-8 lg:p-10">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                To simplify international trade for our clients by providing
                comprehensive, reliable, and cost-effective import-export
                services backed by expert guidance and cutting-edge logistics
                solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
                Who We Are
              </span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">
                14+ Years of Excellence in International Trade
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Founded in Dubai in 2010, GlobalTrade has grown from a small
                trading company to a leading international import-export firm
                serving clients across six continents.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Our deep expertise in hardware products and industrial supplies,
                combined with a vast network of certified suppliers and
                logistics partners, enables us to deliver exceptional value to
                our clients.
              </p>

              <div className="space-y-4">
                {[
                  "Specialized in hardware & industrial products",
                  "Network of 200+ verified global suppliers",
                  "End-to-end logistics and documentation support",
                  "24/7 customer service and shipment tracking",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl p-6 shadow-card text-center">
                <Globe className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-3xl font-heading font-bold text-foreground">
                  50+
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-card text-center mt-8">
                <Users className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-3xl font-heading font-bold text-foreground">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">Clients</div>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-card text-center">
                <Handshake className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-3xl font-heading font-bold text-foreground">
                  200+
                </div>
                <div className="text-sm text-muted-foreground">Suppliers</div>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-card text-center mt-8">
                <Award className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-3xl font-heading font-bold text-foreground">
                  14+
                </div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-background" id="team">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Leadership
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground text-lg">
              Experienced professionals dedicated to your success in global
              trade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-accent font-medium text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Our Foundation
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Core Values
            </h2>
            <p className="text-muted-foreground text-lg">
              The principles that guide every decision and interaction at
              GlobalTrade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/50 text-center hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Certifications & Partnerships
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Trusted & Certified
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="bg-secondary rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-xs">
                    {cert.name.split(" ")[0]}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  {cert.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Partner With Us?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how GlobalTrade can help you achieve your
            international trade goals.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact" className="gap-2">
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
