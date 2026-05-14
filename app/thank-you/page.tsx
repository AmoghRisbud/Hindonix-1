import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-20 min-h-[80vh] flex items-center gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-accent" />
              </div>
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Thank You for Reaching Out!</h1>
            <p className="text-lg text-primary-foreground/80 mb-10">
              We&apos;ve received your quote request and our team will review it promptly. Expect to hear from us within{" "}
              <span className="text-accent font-semibold">24 hours</span>.
            </p>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 mb-10">
              <h2 className="font-heading text-xl font-semibold text-primary-foreground mb-4">What Happens Next?</h2>
              <div className="text-left space-y-4 text-primary-foreground/80">
                {[
                  "Our team reviews your requirements and prepares a tailored response.",
                  "You'll receive a detailed quote within 24 hours.",
                  "We'll schedule a call to discuss your needs in detail.",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent-foreground text-xs font-bold">{i + 1}</span>
                    </div>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link href="/" className="gap-2"><Home className="w-4 h-4" /> Back to Home</Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link href="/products" className="gap-2">View Products <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
