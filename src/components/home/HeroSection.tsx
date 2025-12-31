import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const heroImages = [
  "/images/hero/hero-1.jpg",
  "/images/hero/hero-2.jpg",
  "/images/hero/hero-3.jpg",
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [pause, setPause] = useState(false);

  // Auto transition
  useEffect(() => {
    if (pause) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [pause]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ===== Background Image ===== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero/Hero_BG.png')" }}
      />

      {/* ===== Overlay ===== */}
      <div className="absolute inset-0 bg-black/70" />

      {/* ===== Content ===== */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-28 pb-20">
        <div className="grid lg:grid-cols-[45%_55%] gap-12 items-center">
          {/* LEFT TEXT */}
          <div className="text-center lg:text-left">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Precision-Crafted
              <span className="block text-white/40">
                Architectural Hardware
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Elevating spaces with meticulously designed knobs, door handles,
              and pull handles. Where functionality meets timeless aesthetics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition"
              >
                Request a Quote
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white hover:bg-white/10 transition"
              >
                View Collection
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE REVEAL */}
          <div
            className="relative hidden lg:block w-full h-[520px]"
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
          >
            <div className="relative w-full h-full overflow-hidden">
              {heroImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt="Architectural Hardware"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)]
                    ${
                      index === current
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-110"
                    }`}
                />
              ))}

              {/* Controls */}

              {/* Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-[2px] transition-all ${
                      index === current ? "bg-white w-10" : "bg-white/40 w-6"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
