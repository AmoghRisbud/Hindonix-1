import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getHeroImages } from "@/lib/data";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { ImageDisplay } from "@/components/ImageDisplay";

export function HeroSection() {
  const [heroImages, setHeroImages] = useState<string[]>(["/images/home/hero-knobs.jpg"]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        const images = await getHeroImages();
        console.log('Loaded hero images:', images);
        setHeroImages(images && images.length > 0 ? images : ["/images/home/hero-knobs.jpg"]);
      } catch (error) {
        console.error('Error loading hero image:', error);
      }
    };

    loadHeroImages();

    // Listen for hero image updates from admin
    const handleHeroImageUpdate = async () => {
      const images = await getHeroImages();
      console.log('Updated hero images:', images);
      setHeroImages(images && images.length > 0 ? images : ["/images/home/hero-knobs.jpg"]);
    };

    window.addEventListener("heroImageUpdated", handleHeroImageUpdate);
    return () =>
      window.removeEventListener("heroImageUpdated", handleHeroImageUpdate);
  }, []);

  // Autoplay sliding when multiple images
  useEffect(() => {
    if (!carouselApi || heroImages.length <= 1) return;
    
    console.log('Setting up autoplay for', heroImages.length, 'images');
    
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
        console.error('Autoplay error:', e);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselApi, heroImages]);

  return (
    <section className="relative min-h-screen flex items-center bg-background">
      {/* ===== Content ===== */}
      <div className="container mx-auto px-6 lg:px-12 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT - TEXT CONTENT */}
          <div className="text-center lg:text-left">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6">
              Precision-Crafted
              <span className="block text-foreground">
                Architectural Hardware
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Elevating spaces with meticulously designed knobs, door handles,
              and pull handles. Where functionality meets timeless aesthetics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 font-medium hover:bg-foreground/90 transition"
              >
                Request a Quote
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-foreground/30 text-foreground hover:bg-foreground/5 transition"
              >
                View Collection
              </Link>
            </div>
          </div>

          {/* RIGHT - IMAGE / CAROUSEL */}
          <div className="relative w-full hidden lg:block">
            {console.log('🎨 Rendering with', heroImages.length, 'images')}
            {heroImages.length <= 1 ? (
              <ImageDisplay
                src={heroImages[0]}
                alt="Architectural Hardware Collection"
                className="w-full h-[450px] object-cover"
              />
            ) : (
              <div className="relative">
                <Carousel 
                  setApi={setCarouselApi} 
                  className="w-full"
                  opts={{
                    loop: true,
                    align: "center"
                  }}
                >
                  <CarouselContent>
                    {heroImages.map((img, idx) => (
                      <CarouselItem key={idx}>
                        <ImageDisplay
                          src={img}
                          alt={`Hero ${idx + 1}`}
                          className="w-full h-[450px] object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
