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
    /* Offset top by navbar height (≈ 70px) */
    <section className="relative w-full overflow-hidden bg-[#eaeaea]" style={{ height: 'calc(100vh - 70px)', minHeight: '540px' }}>
      {/* ── FULL-BLEED IMAGE ──────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.length <= 1 ? (
          <ImageDisplay
            src={heroImages[0]}
            alt="Architectural Hardware Collection"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'left 70%' }}
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
                    style={{ objectPosition: 'left 70%' }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* ── TEXT — right-aligned, vertically centered ─────────────── */}
      {/* pt-[70px] corrects centering: section starts at y=0 (behind fixed nav),   */}
      {/* so items-center must account for the 70px overlap to hit true visual center */}
      <div className="relative z-10 h-full flex items-center justify-end" style={{ paddingTop: '70px', paddingRight: 'clamp(2rem, 5vw, 7rem)' }}>
        <div className="text-right">
          {/* Main title */}
          <h1
            className="text-[#1a1a1a] leading-none mb-5 whitespace-nowrap"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              letterSpacing: '0.2em',
              fontSize: 'clamp(1.6rem, 3vw, 4rem)',
              fontWeight: 400,
            }}
          >
            ARCHITECTURAL DOORWARE
          </h1>

          {/* Subtitle */}
          <p
            className="text-[#1a1a1a]/50 mb-9"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(0.7rem, 0.85vw, 0.88rem)',
              fontWeight: 400,
              letterSpacing: '0.06em',
            }}
          >
            Export Grade Craftsmanship
          </p>

          {/* Single pill with both CTAs separated by | */}
          <div className="inline-flex items-center rounded-full border border-[#c8c8c8] bg-[#f4f4f4]/90 overflow-hidden">
            <Link
              href="/products"
              className="px-5 py-2 text-[0.8rem] text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#eaeaea]/70 transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.01em' }}
            >
              View Collections
            </Link>
            <span className="text-[#c0c0c0] text-xs select-none px-0.5">|</span>
            <Link
              href="/contact"
              className="px-5 py-2 text-[0.8rem] text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#eaeaea]/70 transition-colors whitespace-nowrap"
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
