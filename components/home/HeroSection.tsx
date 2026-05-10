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
    /*
     * layout.tsx puts pt-[65px] on <main>, so this section starts exactly
     * at the bottom edge of the fixed navbar. Height fills the rest of the viewport.
     * Image uses object-contain + left center — zero cropping ever.
     * The photo background is #eaeaea, matching the section bg, so no bars appear.
     * Text overlays the right side — product lives in left half of photo so no overlap.
     */
    <section
      className="relative w-full overflow-hidden bg-[#eaeaea]"
      style={{ height: 'calc(100vh - 65px)', minHeight: '500px' }}
    >
      {/* ── IMAGE: full section, object-contain, left-anchored ──────── */}
      <div className="absolute inset-0 w-full h-full">
        {heroImages.length <= 1 ? (
          <ImageDisplay
            src={heroImages[0]}
            alt="Architectural Hardware Collection"
            className="w-full h-full object-contain"
            style={{ objectPosition: 'left center' }}
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
                    style={{ objectPosition: 'left center' }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* TEXT: absolutely positioned from 44% left. Center-aligned to match template. */}
      <div
        className="absolute z-10 flex flex-col items-center justify-center h-full text-center"
        style={{
          left: '40%',
          right: 'clamp(1rem, 3vw, 4rem)',
        }}
      >
        <h1
          className="text-[#1a1a1a] leading-none mb-4 whitespace-nowrap"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            letterSpacing: '0.2em',
            fontSize: 'clamp(1.4rem, 2.8vw, 3.6rem)',
            fontWeight: 400,
          }}
        >
          ARCHITECTURAL DOORWARE
        </h1>

        <p
          className="text-[#1a1a1a]/70 mb-8"
          style={{
            fontFamily: 'Montserrat, system-ui, sans-serif',
            fontSize: 'clamp(0.78rem, 1vw, 1rem)',
            fontWeight: 400,
            letterSpacing: '0.06em',
          }}
        >
          Export Grade Craftsmanship
        </p>

        <div className="inline-flex items-center rounded-full border border-[#c8c8c8] bg-[#f4f4f4]/90 overflow-hidden">
          <Link
            href="/products"
            className="px-7 py-3 text-[0.85rem] text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#eaeaea]/70 transition-colors whitespace-nowrap"
            style={{ fontFamily: 'Montserrat, system-ui, sans-serif', letterSpacing: '0.01em' }}
          >
            View Collections
          </Link>
          <span className="text-[#c0c0c0] text-xs select-none px-0.5">|</span>
          <Link
            href="/contact"
            className="px-7 py-3 text-[0.85rem] text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#eaeaea]/70 transition-colors whitespace-nowrap"
            style={{ fontFamily: 'Montserrat, system-ui, sans-serif', letterSpacing: '0.01em' }}
          >
            Get Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
