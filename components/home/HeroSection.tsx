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
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(480px, 72vh, 820px)' }}>
      {/* ── FULL-BLEED IMAGE ─────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.length <= 1 ? (
          <ImageDisplay
            src={heroImages[0]}
            alt="Architectural Hardware Collection"
            className="w-full h-full object-cover"
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
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
        {/* No overlay — match the clean look in the screenshot */}
      </div>

      {/* ── TEXT — centered-right, vertically centered ─────────── */}
      <div className="relative z-10 h-full flex items-center justify-end px-8 md:px-16 pt-16">
        <div className="text-center max-w-xl">
          {/* Main title */}
          <h1
            className="text-[#1a1a1a] leading-tight mb-4"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              letterSpacing: '0.18em',
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 400,
            }}
          >
            ARCHITECTURAL DOORWARE
          </h1>

          {/* Subtitle — sentence case, no uppercase, matching image */}
          <p
            className="text-[#1a1a1a]/70 mb-10"
            style={{
              fontFamily: 'Montserrat, system-ui, sans-serif',
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
          >
            Export Grade Craftsmanship
          </p>

          {/* Single pill container with both CTAs — exactly matching image */}
          <div
            className="inline-flex items-center rounded-full border border-[#1a1a1a]/20 bg-[#f3f3f3]/70 overflow-hidden"
          >
            <Link
              href="/products"
              className="px-7 py-2.5 text-sm text-[#1a1a1a]/80 hover:text-[#1a1a1a] hover:bg-[#eaeaea]/60 transition-colors"
              style={{ fontFamily: 'Montserrat, system-ui, sans-serif', letterSpacing: '0.01em' }}
            >
              View Collections
            </Link>
            <span className="text-[#1a1a1a]/30 text-base select-none px-0.5">|</span>
            <Link
              href="/contact"
              className="px-7 py-2.5 text-sm text-[#1a1a1a]/80 hover:text-[#1a1a1a] hover:bg-[#eaeaea]/60 transition-colors"
              style={{ fontFamily: 'Montserrat, system-ui, sans-serif', letterSpacing: '0.01em' }}
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
