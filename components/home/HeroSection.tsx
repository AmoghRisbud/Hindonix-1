"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getHeroImages } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImageDisplay } from "@/components/ImageDisplay";

interface HeroSectionProps {
  initialImages?: string[];
}

export function HeroSection({ initialImages }: HeroSectionProps) {
  const [heroImages, setHeroImages] = useState<string[]>(
    initialImages && initialImages.length > 0
      ? initialImages
      : ["/images/home/hero-knobs.jpg"]
  );
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!initialImages) {
      getHeroImages()
        .then((images) => {
          if (images && images.length > 0) setHeroImages(images);
        })
        .catch(console.error);
    }

    const handleHeroImageUpdate = () => {
      getHeroImages()
        .then((images) => {
          if (images && images.length > 0) setHeroImages(images);
        })
        .catch(console.error);
    };

    window.addEventListener("heroImageUpdated", handleHeroImageUpdate);
    return () =>
      window.removeEventListener("heroImageUpdated", handleHeroImageUpdate);
  }, [initialImages]);

  useEffect(() => {
    if (!carouselApi || heroImages.length <= 1) return;
    const interval = setInterval(() => {
      try {
        const index = carouselApi.selectedScrollSnap();
        if (index >= heroImages.length - 1) {
          carouselApi.scrollTo(0);
        } else {
          carouselApi.scrollNext();
        }
      } catch (e) {}
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselApi, heroImages]);

  return (
    /* Offset top by navbar height (≈ 65px) */
    <section className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 65px)', minHeight: '520px' }}>
      {/* ── FULL-BLEED IMAGE ──────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.length <= 1 ? (
          <ImageDisplay
            src={heroImages[0]}
            alt="Architectural Hardware Collection"
            className="w-full h-full object-cover object-left"
          />
        ) : (
          <Carousel
            setApi={setCarouselApi}
            className="w-full h-full"
            opts={{ loop: true, align: "center" }}
          >
            <CarouselContent className="h-full">
              {heroImages.map((img, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <ImageDisplay
                    src={img}
                    alt={`Hero ${idx + 1}`}
                    className="w-full h-full object-cover object-left"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* ── TEXT — right-aligned, vertically centered ─────────────── */}
      <div className="relative z-10 h-full flex items-center justify-end pr-12 lg:pr-20">
        <div className="text-right max-w-lg">
          {/* Main title */}
          <h1
            className="text-[#1a1a1a] leading-tight mb-3"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              letterSpacing: '0.22em',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)',
              fontWeight: 400,
            }}
          >
            ARCHITECTURAL DOORWARE
          </h1>

          {/* Subtitle */}
          <p
            className="text-[#1a1a1a]/65 mb-8"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
              fontWeight: 400,
              letterSpacing: '0.03em',
            }}
          >
            Export Grade Craftsmanship
          </p>

          {/* Single pill with both CTAs separated by | */}
          <div className="inline-flex items-center rounded-full border border-[#bbb] bg-[#f2f2f2]/80 overflow-hidden">
            <Link
              href="/products"
              className="px-6 py-2.5 text-sm text-[#1a1a1a]/75 hover:text-[#1a1a1a] hover:bg-[#e8e8e8]/60 transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.01em' }}
            >
              View Collections
            </Link>
            <span className="text-[#aaa] text-sm select-none">|</span>
            <Link
              href="/contact"
              className="px-6 py-2.5 text-sm text-[#1a1a1a]/75 hover:text-[#1a1a1a] hover:bg-[#e8e8e8]/60 transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.01em' }}
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
