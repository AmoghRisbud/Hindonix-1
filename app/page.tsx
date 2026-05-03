import { HeroSection } from "@/components/home/HeroSection";
import { OverviewSection } from "@/components/home/OverviewSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
export const dynamic = 'force-dynamic';

import { getHeroImages, getTestimonials } from "@/lib/data";

export default async function HomePage() {
  const [heroImages, testimonials] = await Promise.all([
    getHeroImages().catch(() => [] as string[]),
    getTestimonials().catch(() => []),
  ]);

  return (
    <main className="min-h-screen">
      <HeroSection initialImages={heroImages} />
      <OverviewSection />
      <WhyChooseUsSection />
      <TestimonialsSection initialTestimonials={testimonials} />
      <CTASection />
    </main>
  );
}
