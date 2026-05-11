"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Search, Package, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import {
  type Product, type Category, type Subcategory, type Material, type Finish,
} from "@/lib/data";

interface ProductsClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialSubcategories: Subcategory[];
  initialMaterials: Material[];
  initialFinishes: Finish[];
}

export function ProductsClient({
  initialProducts: products,
  initialCategories: categories,
  initialSubcategories: subcategories,
  initialMaterials: materials,
  initialFinishes: finishes,
}: ProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const allCategories = useMemo(() => {
    const names = new Set(products.map((p) => p.category).filter(Boolean));
    return categories.filter((c) => names.has(c.name));
  }, [products, categories]);

  const allSubcategories = useMemo(() => {
    const names = new Set(products.map((p) => p.subcategory).filter((s): s is string => !!s));
    return subcategories.filter((s) => names.has(s.name));
  }, [products, subcategories]);

  const allMaterials = useMemo(() => {
    const names = new Set(products.map((p) => p.material).filter(Boolean));
    return materials.filter((m) => names.has(m.name));
  }, [products, materials]);

  const allFinishNames = useMemo(() => {
    const names = new Set<string>();
    products.forEach((p) => {
      (p.finishes || []).forEach((f) => names.add(f));
      (p.finishIds || []).forEach((fid) => {
        const f = finishes.find((x) => x.id === fid);
        if (f) names.add(f.name);
      });
    });
    return Array.from(names).sort();
  }, [products, finishes]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedSubcategories.length && (!p.subcategory || !selectedSubcategories.includes(p.subcategory))) return false;
      if (selectedMaterials.length && !selectedMaterials.includes(p.material)) return false;
      if (selectedFinishes.length) {
        const pFinishNames = [
          ...(p.finishes || []),
          ...(p.finishIds || []).map((fid) => finishes.find((x) => x.id === fid)?.name).filter((n): n is string => !!n),
        ];
        if (!selectedFinishes.some((f) => pFinishNames.includes(f))) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, selectedCategories, selectedSubcategories, selectedMaterials, selectedFinishes, searchQuery, finishes]);

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedMaterials.length > 0 || selectedFinishes.length > 0 || !!searchQuery;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedMaterials([]);
    setSelectedFinishes([]);
    setSearchQuery("");
  };

  const toggleFilter = <T extends string>(value: T, current: T[], setter: (v: T[]) => void) => {
    setter(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={clearAllFilters} className="text-xs text-accent hover:underline font-medium">
          Clear all filters
        </button>
      )}

      {allCategories.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Category</h3>
          <div className="space-y-2">
            {allCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => toggleFilter(cat.name, selectedCategories, setSelectedCategories)}
                  className="rounded border-border"
                />
                <span className={cn("text-sm transition-colors", selectedCategories.includes(cat.name) ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground")}>
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {allSubcategories.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Type</h3>
          <div className="space-y-2">
            {allSubcategories.map((sub) => (
              <label key={sub.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedSubcategories.includes(sub.name)}
                  onChange={() => toggleFilter(sub.name, selectedSubcategories, setSelectedSubcategories)}
                  className="rounded border-border"
                />
                <span className={cn("text-sm transition-colors", selectedSubcategories.includes(sub.name) ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground")}>
                  {sub.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {allMaterials.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Material</h3>
          <div className="space-y-2">
            {allMaterials.map((mat) => (
              <label key={mat.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(mat.name)}
                  onChange={() => toggleFilter(mat.name, selectedMaterials, setSelectedMaterials)}
                  className="rounded border-border"
                />
                <span className={cn("text-sm transition-colors", selectedMaterials.includes(mat.name) ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground")}>
                  {mat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {allFinishNames.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Finish</h3>
          <div className="space-y-2">
            {allFinishNames.map((name) => (
              <label key={name} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFinishes.includes(name)}
                  onChange={() => toggleFilter(name, selectedFinishes, setSelectedFinishes)}
                  className="rounded border-border"
                />
                <span className={cn("text-sm transition-colors", selectedFinishes.includes(name) ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground")}>
                  {name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Our Collection</span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Architectural Hardware</h1>
            <p className="text-lg text-primary-foreground/80">Discover our curated collection of precision-crafted door handles and hardware.</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">

          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <p className="text-sm text-muted-foreground">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}</p>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent" />}
            </button>
          </div>

          {/* Mobile filter drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileFilterOpen(false)}>
              <div className="absolute inset-0 bg-black/40" />
              <div
                className="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-background overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading font-semibold text-lg">Filters</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded hover:bg-secondary">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop left filter panel */}
            <aside className="hidden lg:block w-52 flex-shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-semibold text-base flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                  </h2>
                </div>
                <FilterPanel />
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}</p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const finishNames = product.finishIds && product.finishIds.length > 0
                      ? product.finishIds.map((fid) => finishes.find((f) => f.id === fid)?.name).filter((n): n is string => !!n)
                      : product.finishes || [];
                    const visibleFinishes = finishNames.slice(0, 3);

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 hover:shadow-card-hover transition-all duration-300 flex flex-col"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-secondary">
                          <ImageDisplay
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className="px-2.5 py-0.5 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">{product.category}</span>
                            {product.subcategory && (
                              <span className="px-2.5 py-0.5 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">{product.subcategory}</span>
                            )}
                            <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-medium">{product.material}</span>
                          </div>
                          <h3 className="font-heading text-base font-semibold text-foreground mb-1.5 group-hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-1">{product.description}</p>
                          {finishNames.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-auto">
                              {visibleFinishes.map((f, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">{f}</span>
                              ))}
                              {finishNames.length > 3 && (
                                <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">+{finishNames.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-24">
                  <Package className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-5">Try adjusting your filters or search term.</p>
                  <Button onClick={clearAllFilters} variant="outline">Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">Looking for Custom Solutions?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">We offer bespoke architectural hardware tailored to your project specifications. Contact our team to discuss custom finishes, sizes, and designs.</p>
            <Button variant="hero" size="xl" asChild>
              <Link href="/contact" className="gap-2">Request Custom Quote <ArrowRight className="w-5 h-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
