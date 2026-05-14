import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hindonix - Premium Architectural Hardware",
  description:
    "Hindonix manufactures and exports premium stainless steel and brass architectural hardware including door knobs, handles, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body>
          <Providers>
            <TooltipProvider>
              <ScrollToTop />
              <Navbar />
              <main className="pt-[65px]">{children}</main>
              <Footer />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
