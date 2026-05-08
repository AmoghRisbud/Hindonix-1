"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { type Product } from "@/lib/data";

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <div className="bg-card rounded-2xl overflow-hidden border border-border/50 aspect-square">
              <ImageDisplay src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">{product.category}</span>
                {product.subcategory && <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">{product.subcategory}</span>}
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">{product.material}</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
              {product.modelNumber && (
                <p className="text-muted-foreground text-sm mb-6">Model: <span className="font-medium text-foreground">{product.modelNumber}</span></p>
              )}
              <div className="mb-6">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
              {product.longDescription && (
                <div className="mb-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Details</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.longDescription}</p>
                </div>
              )}
              {product.finishes && product.finishes.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Available Finishes</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.finishes.map((finish, index) => (
                      <span key={index} className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-foreground border border-border hover:border-accent transition-colors">{finish}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-auto">
                <Button size="lg" asChild className="w-full sm:w-auto gap-2">
                  <Link href="/contact">Request Quote <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
