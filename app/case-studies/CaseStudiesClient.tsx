"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { type CaseStudy } from "@/lib/data";

const filters = ["All", "Export", "Import", "Logistics", "Consulting"];

export function CaseStudiesClient({ initialCaseStudies }: { initialCaseStudies: CaseStudy[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const filteredCases = initialCaseStudies.filter((s) => activeFilter === "All" || s.category === activeFilter);

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Case Studies</span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Success Stories That Inspire</h1>
            <p className="text-lg text-primary-foreground/80">Explore how we&apos;ve helped businesses overcome challenges and achieve their international trade goals.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={cn("px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300", activeFilter === filter ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-accent/10")}>
                {filter}
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredCases.map((study) => (
              <div key={study.id} className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300">
                <div className="aspect-[16/9] overflow-hidden">
                  <ImageDisplay src={study.image} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-accent/10 rounded-full text-xs font-medium text-accent">{study.category}</span>
                    <span className="flex items-center gap-1 text-muted-foreground text-sm"><MapPin className="w-3.5 h-3.5" />{study.location}</span>
                  </div>
                  <h3 className="font-heading text-xl lg:text-2xl font-bold text-foreground mb-2">{study.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{study.client}</p>
                  <div className="space-y-4 mb-6">
                    {[{ label: "Challenge", content: study.problem }, { label: "Solution", content: study.solution }, { label: "Outcome", content: study.outcome }].map(({ label, content }) => (
                      <div key={label}>
                        <h4 className="font-semibold text-foreground text-sm mb-1">{label}</h4>
                        <p className="text-muted-foreground text-sm">{content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                    {study.stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-xl lg:text-2xl font-heading font-bold text-accent">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">Let&apos;s discuss how Hindonix can help you achieve similar results for your business.</p>
          <Button variant="accent" size="xl" asChild>
            <Link href="/contact" className="gap-2">Start Your Project <ArrowRight className="w-5 h-5" /></Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
