import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Ahmad Al-Rashid",
    role: "CEO",
    company: "Al-Rashid Industrial Supplies",
    location: "Saudi Arabia",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    content:
      "GlobalTrade has transformed our supply chain efficiency. Their expertise in hardware sourcing and logistics has reduced our lead times by 40%. Exceptional service and reliability.",
    rating: 5,
  },
  {
    id: 2,
    name: "Maria Santos",
    role: "Procurement Director",
    company: "Santos Construction Group",
    location: "Brazil",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    content:
      "Working with GlobalTrade for 5 years now. Their attention to documentation and compliance has made our international operations seamless. A true partner in growth.",
    rating: 5,
  },
  {
    id: 3,
    name: "James Chen",
    role: "Operations Manager",
    company: "Pacific Tools Ltd",
    location: "Australia",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
    content:
      "The team's knowledge of import regulations and their proactive communication sets them apart. They've become an integral extension of our operations team.",
    rating: 5,
  },
  {
    id: 4,
    name: "Elena Kowalski",
    role: "Supply Chain Head",
    company: "EuroHardware GmbH",
    location: "Germany",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
    content:
      "Quality, reliability, and professionalism define GlobalTrade. Their end-to-end solutions have streamlined our sourcing from Asia significantly.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            Client Testimonials
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from our partners who have experienced the GlobalTrade
            difference.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-card border border-border/50 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-24 h-24 text-accent" />
            </div>

            <div className="relative z-10">
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-xl lg:text-2xl text-foreground font-medium leading-relaxed mb-8">
                "{testimonials[activeIndex].content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-accent"
                />
                <div>
                  <div className="font-heading font-semibold text-foreground text-lg">
                    {testimonials[activeIndex].name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[activeIndex].role},{" "}
                    {testimonials[activeIndex].company}
                  </div>
                  <div className="text-accent text-sm font-medium">
                    {testimonials[activeIndex].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === activeIndex
                      ? "bg-accent w-8"
                      : "bg-border hover:bg-muted-foreground"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
