import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { ArrowRight, Search, Package, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  getProducts,
  getCategories,
  getSubcategories,
  getMaterials,
  getFinishes,
  type Product,
  type Category,
  type Subcategory,
  type Material,
  type Finish,
} from "@/lib/data";

type BrowsingStep =
  | "category"
  | "subcategory"
  | "material"
  | "finish"
  | "products";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Navigation state - initialize from URL params
  const [currentStep, setCurrentStep] = useState<BrowsingStep>(
    (searchParams.get("step") as BrowsingStep) || "category"
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    searchParams.get("subcategory")
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(
    searchParams.get("material")
  );
  const [selectedFinish, setSelectedFinish] = useState<string | null>(
    searchParams.get("finish")
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          productsData,
          categoriesData,
          subcategoriesData,
          materialsData,
          finishesData,
        ] = await Promise.all([
          getProducts(),
          getCategories(),
          getSubcategories(),
          getMaterials(),
          getFinishes(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setMaterials(materialsData);
        setFinishes(finishesData);
      } catch (error) {
        console.error("Error loading products data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen for storage changes from other tabs/windows
    window.addEventListener("storage", loadData);
    window.addEventListener("dataUpdated", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("dataUpdated", loadData);
    };
  }, []);

  // Get available materials for selected category/subcategory
  const getAvailableMaterials = () => {
    // Get the selected category ID
    const selectedCat = categories.find((c) => c.name === selectedCategory);
    const selectedSubcat = subcategories.find(
      (s) => s.name === selectedSubcategory
    );

    // Get materials linked to the category/subcategory directly
    const linkedMaterials = materials.filter((m) => {
      // If subcategory is selected, match by subcategory
      if (selectedSubcat && m.subcategoryId === selectedSubcat.id) return true;
      // Otherwise match by category
      if (selectedCat && m.categoryId === selectedCat.id) return true;
      return false;
    });

    // Also get materials from products in this category
    const productsFiltered = products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory)
        return false;
      return true;
    });

    // Combine materials from both sources
    const allMaterialNames = new Set<string>();
    linkedMaterials.forEach((m) => allMaterialNames.add(m.name));
    productsFiltered.forEach((p) => allMaterialNames.add(p.material));

    return Array.from(allMaterialNames);
  };

  // Get available subcategories for selected category
  const getAvailableSubcategories = () => {
    if (!selectedCategory) return [];

    const category = categories.find((c) => c.name === selectedCategory);
    if (!category) return [];

    // Get subcategories linked to this category
    const categorySubcategories = subcategories.filter(
      (s) => s.categoryId === category.id
    );

    // Filter to only show subcategories that have products
    const filtered = products.filter((p) => p.category === selectedCategory);
    const subcategoryNames = new Set(
      filtered.map((p) => p.subcategory).filter((s): s is string => !!s)
    );

    return categorySubcategories
      .filter((s) => subcategoryNames.has(s.name))
      .map((s) => s.name);
  };

  // Get available finishes for selected filters
  const getAvailableFinishes = () => {
    // Get finishes from products matching the current filters
    const filteredProducts = products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory)
        return false;
      if (selectedMaterial && p.material !== selectedMaterial) return false;
      return true;
    });

    const finishesSet = new Set<string>();

    // Add finishes from filtered products
    filteredProducts.forEach((product) => {
      // From legacy string list
      (product.finishes || []).forEach((finish) => {
        finishesSet.add(finish);
      });
      // From ID list
      (product.finishIds || []).forEach((fid) => {
        const f = finishes.find((x) => x.id === fid);
        if (f) finishesSet.add(f.name);
      });
    });

    return Array.from(finishesSet);
  };

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedMaterial(null);
    setSelectedFinish(null);
    setSearchQuery("");

    // Check if this category has subcategories with products
    const categoryObj = categories.find((c) => c.name === category);
    const hasSubcategories =
      categoryObj && getAvailableSubcategories().length > 0;

    const newStep = hasSubcategories ? "subcategory" : "material";
    setCurrentStep(newStep);
    setSearchParams({ step: newStep, category });
  };

  // Handle subcategory selection (for Door Handle)
  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setSelectedMaterial(null);
    setSelectedFinish(null);
    setCurrentStep("material");
    setSearchParams({
      step: "material",
      category: selectedCategory!,
      subcategory,
    });
  };

  // Handle material selection
  const handleMaterialClick = (material: string) => {
    setSelectedMaterial(material);
    setSelectedFinish(null);
    setCurrentStep("finish");
    const params: Record<string, string> = {
      step: "finish",
      category: selectedCategory!,
      material,
    };
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    setSearchParams(params);
  };

  // Handle finish selection
  const handleFinishClick = (finish: string) => {
    setSelectedFinish(finish);
    setCurrentStep("products");
    const params: Record<string, string> = {
      step: "products",
      category: selectedCategory!,
      material: selectedMaterial!,
      finish,
    };
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    setSearchParams(params);
  };

  // Reset to category selection
  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedMaterial(null);
    setSelectedFinish(null);
    setSearchQuery("");
    setCurrentStep("category");
    setSearchParams({});
  };

  // Get filtered products
  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (selectedSubcategory && product.subcategory !== selectedSubcategory)
      return false;
    if (selectedMaterial && product.material !== selectedMaterial) return false;
    if (selectedFinish) {
      const hasByName = (product.finishes || []).includes(selectedFinish);
      const hasById = (product.finishIds || []).some((fid) => {
        const f = finishes.find((x) => x.id === fid);
        return f?.name === selectedFinish;
      });
      if (!hasByName && !hasById) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Our Collection
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Architectural Hardware
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Discover our curated collection of precision-crafted hardware
              product options.
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Products Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
              {/* Breadcrumb Navigation */}
              {(selectedCategory ||
                selectedSubcategory ||
                selectedMaterial ||
                selectedFinish) && (
                <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <button
                    onClick={handleReset}
                    className="hover:text-accent transition-colors"
                  >
                    All Products
                  </button>
                  {selectedCategory && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <button
                        onClick={() => {
                          setSelectedSubcategory(null);
                          setSelectedMaterial(null);
                          setSelectedFinish(null);
                          setCurrentStep(
                            selectedCategory === "Door Handle"
                              ? "subcategory"
                              : "material"
                          );
                        }}
                        className="hover:text-accent transition-colors"
                      >
                        {selectedCategory}
                      </button>
                    </>
                  )}
                  {selectedSubcategory && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <button
                        onClick={() => {
                          setSelectedMaterial(null);
                          setSelectedFinish(null);
                          setCurrentStep("material");
                        }}
                        className="hover:text-accent transition-colors"
                      >
                        {selectedSubcategory}
                      </button>
                    </>
                  )}
                  {selectedMaterial && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <button
                        onClick={() => {
                          setSelectedFinish(null);
                          setCurrentStep("finish");
                        }}
                        className="hover:text-accent transition-colors"
                      >
                        {selectedMaterial}
                      </button>
                    </>
                  )}
                  {selectedFinish && (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <span className="text-foreground font-medium">
                        {selectedFinish}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Search - Only show on products view */}
              {currentStep === "products" && (
                <div className="mb-8 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Category Selection */}
              {currentStep === "category" && (
                <div className="bg-card rounded-2xl p-8 border border-border/50">
                  <div className="text-center mb-8">
                    <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                      Select a Category
                    </h2>
                    <p className="text-muted-foreground">
                      Choose the type of product you're looking for
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.name)}
                        className="group bg-background border-2 border-border rounded-xl p-8 hover:border-accent hover:shadow-lg transition-all duration-300 text-center"
                      >
                        <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcategory Selection */}
              {currentStep === "subcategory" &&
                selectedCategory &&
                getAvailableSubcategories().length > 0 && (
                  <div className="bg-card rounded-2xl p-8 border border-border/50">
                    <div className="text-center mb-8">
                      <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                        Select {selectedCategory} Type
                      </h2>
                      <p className="text-muted-foreground">
                        Choose the specific type
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      {getAvailableSubcategories().map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => handleSubcategoryClick(subcategory)}
                          className="group bg-background border-2 border-border rounded-xl p-8 hover:border-accent hover:shadow-lg transition-all duration-300 text-center"
                        >
                          <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                            {subcategory}
                          </h3>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Material Selection */}
              {currentStep === "material" && (
                <div className="bg-card rounded-2xl p-8 border border-border/50">
                  <div className="text-center mb-8">
                    <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                      Select Material
                    </h2>
                    <p className="text-muted-foreground">
                      Choose the material type
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {getAvailableMaterials().map((material) => (
                      <button
                        key={material}
                        onClick={() => handleMaterialClick(material)}
                        className="group bg-background border-2 border-border rounded-xl p-8 hover:border-accent hover:shadow-lg transition-all duration-300 text-center"
                      >
                        <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                          {material}
                        </h3>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Finish Selection */}
              {currentStep === "finish" && (
                <div className="bg-card rounded-2xl p-8 border border-border/50">
                  <div className="text-center mb-8">
                    <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                      Select a Finish
                    </h2>
                    <p className="text-muted-foreground">
                      Choose from available finishes
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {getAvailableFinishes().map((finishName) => {
                      // Find the finish object to get the image
                      const finishObj = finishes.find(
                        (f) => f.name === finishName
                      );
                      return (
                        <button
                          key={finishName}
                          onClick={() => handleFinishClick(finishName)}
                          className="group bg-background border border-border rounded-xl p-4 hover:border-accent hover:shadow-md transition-all duration-300 text-left"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-secondary">
                            {finishObj ? (
                              <ImageDisplay
                                src={finishObj.image}
                                alt={finishName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <p className="font-medium text-sm text-foreground group-hover:text-accent transition-colors">
                            {finishName}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {currentStep === "products" && (
                <>
                  {filteredProducts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredProducts.map((product, index) => {
                        // Build the product detail URL with current state
                        const productUrl = `/products/${
                          product.id
                        }?from=${encodeURIComponent(
                          location.pathname + location.search
                        )}`;

                        return (
                          <div
                            key={product.id}
                            className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300"
                          >
                            <Link to={productUrl} className="block">
                              <div className="aspect-[4/3] overflow-hidden">
                                <ImageDisplay
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 animate-slide-in-left"
                                  style={{ animationDelay: `${index * 0.1}s` }}
                                />
                              </div>
                              <div className="p-6 pb-4">
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                  <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">
                                    {product.category}
                                  </span>
                                  {product.subcategory && (
                                    <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">
                                      {product.subcategory}
                                    </span>
                                  )}
                                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                                    {product.material}
                                  </span>
                                </div>
                                <h3 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3">
                                  {product.description}
                                </p>
                                <div className="mb-0">
                                  <p className="text-xs text-muted-foreground mb-2">
                                    Available Finishes:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {(() => {
                                      const names =
                                        product.finishIds &&
                                        product.finishIds.length > 0
                                          ? product.finishIds
                                              .map(
                                                (fid) =>
                                                  finishes.find(
                                                    (f) => f.id === fid
                                                  )?.name
                                              )
                                              .filter((n): n is string => !!n)
                                          : product.finishes || [];
                                      const visible = names.slice(0, 3);
                                      return (
                                        <>
                                          {visible.map((finish, index) => (
                                            <span
                                              key={index}
                                              className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground"
                                            >
                                              {finish}
                                            </span>
                                          ))}
                                          {names.length > 3 && (
                                            <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                                              +{names.length - 3} more
                                            </span>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </Link>
                            <div className="px-6 pb-6 pt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2"
                                asChild
                              >
                                <Link to="/contact">
                                  Request Quote
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                        No products found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filter criteria.
                      </p>
                      <Button onClick={handleReset} variant="outline">
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Custom Sourcing CTA */}
          <section className="py-20 bg-secondary">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="bg-primary rounded-3xl p-8 lg:p-12 text-center">
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                  Looking for Custom Solutions?
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                  We offer bespoke architectural hardware tailored to your
                  project specifications. Contact our team to discuss custom
                  finishes, sizes, and designs.
                </p>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/contact" className="gap-2">
                    Request Custom Quote
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </main>
  );
};

export default Products;
