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
    /* Grid layout: image owns left 55% | text owns right 45% — no overlap possible */
    <section
      className="w-full bg-[#eaeaea]"
      style={{ height: 'calc(100vh - 70px)', minHeight: '540px' }}
    >
      <div className="grid h-full" style={{ gridTemplateColumns: '55% 45%' }}>

        {/* ── LEFT: full product image — object-contain, zero cropping ── */}
        <div className="h-full overflow-hidden">
          {heroImages.length <= 1 ? (
            <ImageDisplay
              src={heroImages[0]}
              alt="Architectural Hardware Collection"
              className="w-full h-full object-contain"
              style={{ objectPosition: 'left bottom' }}
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
                      className="w-full h-full object-contain"
                      style={{ objectPosition: 'left bottom' }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>

        {/* ── RIGHT: text block — vertically centered, no overlap ────── */}
        <div
          className="flex flex-col items-end justify-center text-right"
          style={{ paddingRight: 'clamp(2rem, 5vw, 6rem)', paddingLeft: '1rem' }}
        >
          {/* Main title */}
          <h1
            className="text-[#1a1a1a] leading-none mb-5"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              letterSpacing: '0.2em',
              fontSize: 'clamp(1.4rem, 2.6vw, 3.5rem)',
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

          {/* Single pill CTA */}
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
