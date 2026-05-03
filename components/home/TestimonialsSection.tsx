"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTestimonials, type Testimonial } from "@/lib/data";
import { ImageDisplay } from "@/components/ImageDisplay";

interface TestimonialsSectionProps {
  initialTestimonials?: Testimonial[];
}

export function TestimonialsSection({ initialTestimonials }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials ?? []);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!initialTestimonials) {
      getTestimonials().then(setTestimonials).catch(console.error);
    }
    const reload = () => getTestimonials().then(setTestimonials).catch(console.error);
    window.addEventListener("dataUpdated", reload);
    return () => window.removeEventListener("dataUpdated", reload);
  }, [initialTestimonials]);

  useEffect(() => {
    if (activeIndex >= testimonials.length) setActiveIndex(0);
  }, [testimonials.length, activeIndex]);

  if (!testimonials.length) return null;

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Client Testimonials</span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">Trusted by Businesses Worldwide</h2>
          <p className="text-muted-foreground text-lg">Hear from our partners who have experienced the Hindonix difference.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-card border border-border/50 relative overflow-hidden">
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-24 h-24 text-accent" />
            </div>
            <div className="relative z-10">
              <blockquote className="text-xl lg:text-2xl text-foreground font-medium leading-relaxed mb-8">
                &ldquo;{testimonials[activeIndex].content}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                {testimonials[activeIndex].image ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                    <ImageDisplay src={testimonials[activeIndex].image as string} alt={testimonials[activeIndex].name} className="w-full h-full object-cover" />
                  </div>
                ) : null}
                <div>
                  <div className="font-heading font-semibold text-foreground text-lg">{testimonials[activeIndex].name}</div>
                  <div className="text-muted-foreground">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</div>
                  <div className="text-accent text-sm font-medium">{testimonials[activeIndex].location}</div>
                  {testimonials[activeIndex].rating ? (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: testimonials[activeIndex].rating }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 shadow-sm" aria-label="Previous testimonial">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button key={index} onClick={() => setActiveIndex(index)} className={cn("w-2.5 h-2.5 rounded-full transition-all duration-300", index === activeIndex ? "bg-accent w-8" : "bg-border hover:bg-muted-foreground")} aria-label={`Go to testimonial ${index + 1}`} />
              ))}
            </div>
            <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 shadow-sm" aria-label="Next testimonial">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
