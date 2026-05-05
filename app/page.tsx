import { HeroSection } from "@/components/home/HeroSection";
import { OverviewSection } from "@/components/home/OverviewSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
export const dynamic = 'force-dynamic';

import { getTestimonials } from "@/lib/data";
import pool from "@/lib/db";

async function getHeroImagesFromDB(): Promise<string[]> {
  try {
    const [rows] = await pool.query("SELECT urls FROM hero_images ORDER BY id DESC LIMIT 1");
    const r = (rows as any[])[0];
    if (!r) return [];
    const urls = typeof r.urls === "string" ? JSON.parse(r.urls) : r.urls;
    return Array.isArray(urls) && urls.length > 0 ? urls : [];
  } catch (err) {
    console.error("[HomePage] getHeroImagesFromDB failed:", err);
    return [];
  }
}

export default async function HomePage() {
  const [heroImages, testimonials] = await Promise.all([
    getHeroImagesFromDB(),
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
