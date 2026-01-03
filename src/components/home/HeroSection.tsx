import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getHeroImage } from "@/lib/data";
import { ImageDisplay } from "@/components/ImageDisplay";

export function HeroSection() {
  const [heroImage, setHeroImage] = useState<string>(getHeroImage());

  useEffect(() => {
    // Listen for hero image updates from admin
    const handleHeroImageUpdate = () => {
      setHeroImage(getHeroImage());
    };

    window.addEventListener("heroImageUpdated", handleHeroImageUpdate);
    return () =>
      window.removeEventListener("heroImageUpdated", handleHeroImageUpdate);
  }, []);

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

          {/* RIGHT - IMAGE */}
          <div className="relative w-full hidden lg:block">
            <ImageDisplay
              src={heroImage}
              alt="Architectural Hardware Collection"
              className="w-full h-[450px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
