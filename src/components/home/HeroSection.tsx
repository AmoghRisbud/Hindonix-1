import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getHeroImages } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImageDisplay } from "@/components/ImageDisplay";

export function HeroSection() {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        const images = await getHeroImages();
        setHeroImages(images && images.length > 0 ? images : []);
      } catch (error) {
        console.error("Error loading hero image:", error);
      }
    };

    loadHeroImages();

    const handleHeroImageUpdate = async () => {
      const images = await getHeroImages();
      setHeroImages(images && images.length > 0 ? images : []);
    };

    window.addEventListener("heroImageUpdated", handleHeroImageUpdate);
    return () =>
      window.removeEventListener("heroImageUpdated", handleHeroImageUpdate);
  }, []);

  // Autoplay sliding when multiple images
  useEffect(() => {
    if (!carouselApi || heroImages.length <= 1) return;

    const interval = setInterval(() => {
      try {
        const index = carouselApi.selectedScrollSnap();
        const lastIndex = heroImages.length - 1;
        if (index >= lastIndex) {
          carouselApi.scrollTo(0);
        } else {
          carouselApi.scrollNext();
        }
      } catch (e) {
        console.error("Autoplay error:", e);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselApi, heroImages]);

  const renderHeroImage = () => {
    if (heroImages.length === 0) return null;

    if (heroImages.length === 1) {
      return (
        <ImageDisplay
          src={heroImages[0]}
          alt="Architectural Hardware"
          className="w-full h-full object-cover"
        />
      );
    }

    return (
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
    );
  };

  return (
    <section className="relative min-h-screen flex items-center bg-[#eaeaea] overflow-hidden">
      <div className="flex w-full min-h-screen">
        {/* LEFT – IMAGE */}
        <div className="hidden lg:block lg:w-[55%] relative min-h-screen">
          {heroImages.length > 0 ? (
            <div className="absolute inset-0">{renderHeroImage()}</div>
          ) : (
            <div className="absolute inset-0 bg-[#222]" />
          )}
        </div>

        {/* RIGHT – TEXT CONTENT */}
        <div className="w-full lg:w-[45%] flex items-center justify-center px-8 lg:px-16 py-32 lg:py-0">
          <div className="text-center">
            <h1
              className="text-[#1a1a1a] text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] uppercase leading-tight mb-4"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Architectural
              <span className="block">Doorware</span>
            </h1>

            <p className="text-[#1a1a1a]/60 text-base md:text-lg tracking-wide mb-10">
              Export Grade Craftsmanship
            </p>

            <div className="inline-flex items-center bg-black/[0.04] rounded-full divide-x divide-black/10">
              <Link
                to="/products"
                className="px-7 py-3 text-[#1a1a1a] text-sm tracking-wider hover:bg-black/[0.06] rounded-l-full transition-colors"
              >
                View Collections
              </Link>
              <span className="text-[#1a1a1a]/30 select-none">|</span>
              <Link
                to="/contact"
                className="px-7 py-3 text-[#1a1a1a] text-sm tracking-wider hover:bg-black/[0.06] rounded-r-full transition-colors"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile hero image (below text on small screens) */}
      {heroImages.length > 0 && (
        <div className="lg:hidden absolute inset-0 -z-0">
          <div className="w-full h-full opacity-20">{renderHeroImage()}</div>
        </div>
      )}
    </section>
  );
}
