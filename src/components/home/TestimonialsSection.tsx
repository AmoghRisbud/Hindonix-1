import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "David Richardson",
    role: "Lead Architect",
    company: "Richardson & Partners",
    location: "London, UK",
    image: "/images/testimonials/client-1.jpg",
    content:
      "Hindonix hardware has become our go-to specification for luxury residential projects. The PVD finishes are exceptional and the quality is consistently outstanding.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    role: "Interior Designer",
    company: "Mitchell Design Studio",
    location: "Dubai, UAE",
    image: "/images/testimonials/client-2.jpg",
    content:
      "The attention to detail in Hindonix products is remarkable. Their brass knobs and door handles add that perfect finishing touch to our high-end projects.",
    rating: 5,
  },
  {
    id: 3,
    name: "James Thompson",
    role: "Project Manager",
    company: "Thompson Construction",
    location: "Manchester, UK",
    image: "/images/testimonials/client-3.jpg",
    content:
      "Reliable delivery and consistent quality. Hindonix has never let us down on our commercial projects. Their range of finishes meets all our specification needs.",
    rating: 5,
  },
  {
    id: 4,
    name: "Fatima Al-Mansoori",
    role: "Procurement Director",
    company: "Al-Mansoori Developments",
    location: "Abu Dhabi, UAE",
    image: "/images/testimonials/client-4.jpg",
    content:
      "Outstanding B2B partnership. Hindonix understands the demands of large-scale projects and delivers premium hardware that exceeds expectations every time.",
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
            Hear from our partners who have experienced the Hindonix difference.
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
              {/* Content */}
              <blockquote className="text-xl lg:text-2xl text-foreground font-medium leading-relaxed mb-8">
                "{testimonials[activeIndex].content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
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
