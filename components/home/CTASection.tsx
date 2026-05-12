"use client";

import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { getCTAImage } from "@/lib/data";

interface CTASectionProps {
  initialBgImage?: string;
}

export function CTASection({ initialBgImage }: CTASectionProps) {
  const [bgImage, setBgImage] = useState<string>(initialBgImage || "");

  useEffect(() => {
    if (!initialBgImage) {
      getCTAImage()
        .then((url) => { if (url) setBgImage(url); })
        .catch(console.error);
    }

    const handleUpdate = () => {
      getCTAImage()
        .then((url) => setBgImage(url || ""))
        .catch(console.error);
    };
    window.addEventListener("ctaImageUpdated", handleUpdate);
    return () => window.removeEventListener("ctaImageUpdated", handleUpdate);
  }, [initialBgImage]);

  const bgStyle = bgImage
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : { backgroundColor: "#1a1a1a" };

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#eaeaea' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden" style={bgStyle}>
          {/* Dark overlay — always present to keep text readable; slightly lighter when no bg image */}
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundColor: bgImage ? "rgba(0,0,0,0.60)" : "#1a1a1a" }}
          />
          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-5xl font-semibold text-[#eaeaea] mb-6 tracking-tight">Ready to Elevate Your Next Project?</h2>
              <p className="text-base lg:text-lg text-[#f3f3f3]/70 mb-10 max-w-2xl mx-auto font-light">Discover how our premium architectural hardware can bring sophistication and functionality to your residential or commercial space.</p>
              <div className="flex flex-col sm:flex-row gap-0 justify-center mb-12 border border-[#eaeaea]/20 w-fit mx-auto">
                <Link
                  href="/contact"
                  className="px-10 py-4 bg-[#eaeaea] text-[#1a1a1a] text-xs font-medium tracking-[0.2em] uppercase hover:bg-white transition-colors"
                >
                  Request a Quote
                </Link>
                <Link
                  href="/products"
                  className="px-10 py-4 border-t border-[#eaeaea]/20 sm:border-t-0 sm:border-l text-[#eaeaea] text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#eaeaea]/10 transition-colors"
                >
                  View Collection
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[#f3f3f3]/60 text-sm">
                <a href="tel:+918850765050" className="flex items-center gap-2 hover:text-[#f3f3f3] transition-colors font-light">
                  <Phone className="w-4 h-4 text-[#f3f3f3]" />
                  <span>+91 8850765050</span>
                </a>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-[#f3f3f3]/20" />
                <a href="mailto:info@hindonix.com" className="flex items-center gap-2 hover:text-[#f3f3f3] transition-colors font-light">
                  <Mail className="w-4 h-4 text-[#f3f3f3]" />
                  <span>info@hindonix.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
