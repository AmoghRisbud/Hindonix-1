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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);

  const getAvailableSubcategories = () => {
    if (!selectedCategory) return [];
    const category = categories.find((c) => c.name === selectedCategory);
    if (!category) return [];
    const catSubcats = subcategories.filter((s) => s.categoryId === category.id);
    const subcatNames = new Set(products.filter((p) => p.category === selectedCategory).map((p) => p.subcategory).filter((s): s is string => !!s));
    return catSubcats.filter((s) => subcatNames.has(s.name)).map((s) => s.name);
  };

  const getAvailableMaterials = () => {
    const selectedCat = categories.find((c) => c.name === selectedCategory);
    const selectedSubcat = subcategories.find((s) => s.name === selectedSubcategory);
    const linkedMaterials = materials.filter((m) => {
      if (selectedSubcat && m.subcategoryId === selectedSubcat.id) return true;
      if (selectedCat && m.categoryId === selectedCat.id) return true;
      return false;
    });
    const filteredProducts = products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
      return true;
    });
    const allMaterialNames = new Set<string>();
    linkedMaterials.forEach((m) => allMaterialNames.add(m.name));
    filteredProducts.forEach((p) => allMaterialNames.add(p.material));
    return Array.from(allMaterialNames);
  };

  const getAvailableFinishes = () => {
    const filteredProducts = products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
      if (selectedMaterial && p.material !== selectedMaterial) return false;
      return true;
    });
    const finishesSet = new Set<string>();
    filteredProducts.forEach((product) => {
      (product.finishes || []).forEach((f) => finishesSet.add(f));
      (product.finishIds || []).forEach((fid) => {
        const f = finishes.find((x) => x.id === fid);
        if (f) finishesSet.add(f.name);
      });
    });
    return Array.from(finishesSet);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedMaterial(null);
    setSelectedFinish(null);
    setSearchQuery("");
    const categoryObj = categories.find((c) => c.name === category);
    const hasSubcategories = !!categoryObj && getAvailableSubcategories().length > 0;
    setCurrentStep(hasSubcategories ? "subcategory" : "material");
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setSelectedMaterial(null);
    setSelectedFinish(null);
    setCurrentStep("material");
  };

  const handleMaterialClick = (material: string) => {
    setSelectedMaterial(material);
    setSelectedFinish(null);
    setCurrentStep("finish");
  };

  const handleFinishClick = (finish: string) => {
    setSelectedFinish(finish);
    setCurrentStep("products");
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedMaterial(null);
    setSelectedFinish(null);
    setSearchQuery("");
    setCurrentStep("category");
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (selectedSubcategory && product.subcategory !== selectedSubcategory) return false;
    if (selectedMaterial && product.material !== selectedMaterial) return false;
    if (selectedFinish) {
      const hasByName = (product.finishes || []).includes(selectedFinish);
      const hasById = (product.finishIds || []).some((fid) => finishes.find((x) => x.id === fid)?.name === selectedFinish);
      if (!hasByName && !hasById) return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Our Collection</span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Architectural Hardware</h1>
            <p className="text-lg text-primary-foreground/80">Discover our curated collection of precision-crafted hardware product options.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {(selectedCategory || selectedSubcategory || selectedMaterial || selectedFinish) && (
            <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <button onClick={handleReset} className="hover:text-accent transition-colors">All Products</button>
              {selectedCategory && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <button onClick={() => { setSelectedSubcategory(null); setSelectedMaterial(null); setSelectedFinish(null); setCurrentStep("subcategory"); }} className="hover:text-accent transition-colors">{selectedCategory}</button>
                </>
              )}
              {selectedSubcategory && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <button onClick={() => { setSelectedMaterial(null); setSelectedFinish(null); setCurrentStep("material"); }} className="hover:text-accent transition-colors">{selectedSubcategory}</button>
                </>
              )}
              {selectedMaterial && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <button onClick={() => { setSelectedFinish(null); setCurrentStep("finish"); }} className="hover:text-accent transition-colors">{selectedMaterial}</button>
                </>
              )}
              {selectedFinish && (<><ChevronRight className="w-4 h-4" /><span className="text-foreground font-medium">{selectedFinish}</span></>)}
            </div>
          )}

          {currentStep === "products" && (
            <div className="mb-8 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all" />
              </div>
            </div>
          )}

          {currentStep === "category" && (
            <div className="bg-card rounded-2xl p-8 border border-border/50">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Select a Category</h2>
                <p className="text-muted-foreground">Choose the type of product you&apos;re looking for</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {categories.map((category) => (
                  <button key={category.id} onClick={() => handleCategoryClick(category.name)} className="group bg-background border-2 border-border rounded-xl p-8 hover:border-accent hover:shadow-lg transition-all duration-300 text-center">
                    <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">{category.name}</h3>
                    {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "subcategory" && selectedCategory && getAvailableSubcategories().length > 0 && (
            <div className="bg-card rounded-2xl p-8 border border-border/50">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Select {selectedCategory} Type</h2>
                <p className="text-muted-foreground">Choose the specific type</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {getAvailableSubcategories().map((subcategory) => (
                  <button key={subcategory} onClick={() => handleSubcategoryClick(subcategory)} className="group bg-background border-2 border-border rounded-xl p-8 hover:border-accent hover:shadow-lg transition-all duration-300 text-center">
                    <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">{subcategory}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "material" && (
            <div className="bg-card rounded-2xl p-8 border border-border/50">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Select Material</h2>
                <p className="text-muted-foreground">Choose the material type</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {getAvailableMaterials().map((material) => (
                  <button key={material} onClick={() => handleMaterialClick(material)} className="group bg-background border-2 border-border rounded-xl p-8 hover:border-accent hover:shadow-lg transition-all duration-300 text-center">
                    <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">{material}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === "finish" && (
            <div className="bg-card rounded-2xl p-8 border border-border/50">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Select a Finish</h2>
                <p className="text-muted-foreground">Choose from available finishes</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getAvailableFinishes().map((finishName) => {
                  const finishObj = finishes.find((f) => f.name === finishName);
                  return (
                    <button key={finishName} onClick={() => handleFinishClick(finishName)} className="group bg-background border border-border rounded-xl p-4 hover:border-accent hover:shadow-md transition-all duration-300 text-left">
                      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-secondary">
                        {finishObj ? (
                          <ImageDisplay src={finishObj.image} alt={finishName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                        )}
                      </div>
                      <p className="font-medium text-sm text-foreground group-hover:text-accent transition-colors">{finishName}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === "products" && (
            filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => {
                  const names = product.finishIds && product.finishIds.length > 0
                    ? product.finishIds.map((fid) => finishes.find((f) => f.id === fid)?.name).filter((n): n is string => !!n)
                    : product.finishes || [];
                  const visible = names.slice(0, 3);
                  return (
                    <div key={product.id} className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300">
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="aspect-[4/3] overflow-hidden">
                          <ImageDisplay src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6 pb-4">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">{product.category}</span>
                            {product.subcategory && <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">{product.subcategory}</span>}
                            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">{product.material}</span>
                          </div>
                          <h3 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
                          <div className="mb-0">
                            <p className="text-xs text-muted-foreground mb-2">Available Finishes:</p>
                            <div className="flex flex-wrap gap-1">
                              {visible.map((finish, i) => <span key={i} className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">{finish}</span>)}
                              {names.length > 3 && <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">+{names.length - 3} more</span>}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="px-6 pb-6 pt-0">
                        <Button variant="outline" size="sm" className="w-full gap-2 border-black text-black" asChild>
                          <Link href="/contact">Request Quote <ArrowRight className="w-4 h-4" /></Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
                <Button onClick={handleReset} variant="outline">Reset Filters</Button>
              </div>
            )
          )}
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
