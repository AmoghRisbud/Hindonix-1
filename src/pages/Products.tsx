import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Filter, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getProducts, type Product } from "@/lib/data";

const categories = ["All Products", "Knobs", "Door Handles", "Pull Handles"];

const availableFinishes = [
  "Brass",
  "Polished Stainless Steel",
  "PVD Satin Black",
  "PVD Satin Gold",
  "PVD Satin Bronze",
  "PVD Satin Nickel",
  "PVD Polished Copper",
  "PVD Satin Stainless Steel",
  "Satin Black",
  "Satin Stainless Steel",
  "Satin Nickel",
];

// Map finishes to their image filenames (in /images/finishes/)
const finishImages: Record<string, string> = {
  Brass: "brass.jpg",
  "Polished Stainless Steel": "polished-stainless-steel.jpg",
  "PVD Satin Black": "pvd-satin-black.jpg",
  "PVD Satin Gold": "pvd-satin-gold.jpg",
  "PVD Satin Bronze": "pvd-satin-bronze.jpg",
  "PVD Satin Nickel": "pvd-satin-nickel.jpg",
  "PVD Polished Copper": "pvd-polished-copper.jpg",
  "PVD Satin Stainless Steel": "pvd-satin-stainless-steel.jpg",
  "Satin Black": "satin-black.jpg",
  "Satin Stainless Steel": "satin-stainless-steel.jpg",
  "Satin Nickel": "satin-nickel.jpg",
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFinishSelection, setShowFinishSelection] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  // Get available finishes for the selected category
  const getAvailableFinishesForCategory = (category: string) => {
    const categoryProducts =
      category === "All Products"
        ? products
        : products.filter((p) => p.category === category);

    const finishesSet = new Set<string>();
    categoryProducts.forEach((product) => {
      product.finishes.forEach((finish) => {
        if (availableFinishes.includes(finish)) {
          finishesSet.add(finish);
        }
      });
    });

    return Array.from(finishesSet);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setSelectedFinish(null);
    setSearchQuery("");

    // Show finish selection if not "All Products"
    if (category !== "All Products") {
      setShowFinishSelection(true);
    } else {
      setShowFinishSelection(false);
    }
  };

  const handleFinishSelect = (finish: string) => {
    setSelectedFinish(finish);
    setShowFinishSelection(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All Products" || product.category === activeCategory;
    const matchesFinish =
      !selectedFinish || product.finishes.includes(selectedFinish);
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesFinish && matchesSearch;
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

      {/* Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === category
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent/10"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Finish Selection Screen */}
          {showFinishSelection && (
            <div className="mb-12 bg-card rounded-2xl p-8 border border-border/50">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                  Select a Finish
                </h2>
                <p className="text-muted-foreground">
                  Choose from available finishes for {activeCategory}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getAvailableFinishesForCategory(activeCategory).map(
                  (finish) => (
                    <button
                      key={finish}
                      onClick={() => handleFinishSelect(finish)}
                      className="group bg-background border border-border rounded-xl p-4 hover:border-accent hover:shadow-md transition-all duration-300 text-left"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-secondary">
                        <img
                          src={`/images/finishes/${finishImages[finish]}`}
                          alt={finish}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <p className="font-medium text-sm text-foreground group-hover:text-accent transition-colors">
                        {finish}
                      </p>
                    </button>
                  )
                )}
              </div>
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowFinishSelection(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Active Filter Display */}
          {selectedFinish && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Showing {activeCategory} in:
              </span>
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium flex items-center gap-2">
                {selectedFinish}
                <button
                  onClick={() => {
                    setSelectedFinish(null);
                    setShowFinishSelection(true);
                  }}
                  className="hover:bg-accent/20 rounded-full p-1 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            </div>
          )}

          {/* Products Grid */}
          {!showFinishSelection && filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageDisplay
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 animate-slide-in-left"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {product.description}
                    </p>
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Available Finishes:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {product.finishes.slice(0, 3).map((finish, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground"
                          >
                            {finish}
                          </span>
                        ))}
                        {product.finishes.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                            +{product.finishes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link to="/contact" className="gap-2">
                        Request Quote
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : !showFinishSelection ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : null}
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
              We offer bespoke architectural hardware tailored to your project
              specifications. Contact our team to discuss custom finishes,
              sizes, and designs.
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

      <Footer />
    </main>
  );
};

export default Products;
