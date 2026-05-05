"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="relative w-full" style={{ aspectRatio: "1920/1440" }}>
      {/* FULL-BLEED IMAGE */}
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
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* TEXT CONTENT OVERLAY */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-28 pb-20 text-center">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-medium text-white leading-tight mb-6">
          Precision-Crafted
          <span className="block">Architectural Hardware</span>
        </h1>
        <p className="text-lg lg:text-2xl text-white/80 mb-8 max-w-2xl">
          Elevating spaces with meticulously designed knobs, door handles,
          and pull handles. Where functionality meets timeless aesthetics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-medium hover:bg-white/90 transition"
          >
            Request a Quote
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 border border-white text-white hover:bg-white/10 transition"
          >
            View Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
