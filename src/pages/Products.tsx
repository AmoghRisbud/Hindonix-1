import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Filter, Package } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  "All Products",
  "Hand Tools",
  "Power Tools",
  "Fasteners",
  "Fittings",
  "Valves",
  "Machinery Parts",
];

const products = [
  {
    id: 1,
    name: "Industrial Drill Set",
    category: "Power Tools",
    description:
      "Professional-grade drill set with 50+ attachments for industrial applications.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
    origin: "Germany",
  },
  {
    id: 2,
    name: "Stainless Steel Fasteners Kit",
    category: "Fasteners",
    description:
      "Comprehensive kit of corrosion-resistant fasteners in various sizes.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
    origin: "Japan",
  },
  {
    id: 3,
    name: "Precision Hand Tool Set",
    category: "Hand Tools",
    description:
      "Ergonomic hand tools crafted for precision work and durability.",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop",
    origin: "USA",
  },
  {
    id: 4,
    name: "Industrial Ball Valves",
    category: "Valves",
    description:
      "High-pressure ball valves for chemical and petroleum industries.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    origin: "Italy",
  },
  {
    id: 5,
    name: "Brass Pipe Fittings",
    category: "Fittings",
    description:
      "Premium brass fittings for plumbing and industrial piping systems.",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
    origin: "China",
  },
  {
    id: 6,
    name: "CNC Machinery Components",
    category: "Machinery Parts",
    description:
      "Precision-manufactured components for CNC machines and automation.",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop",
    origin: "Taiwan",
  },
  {
    id: 7,
    name: "Hydraulic Power Tools",
    category: "Power Tools",
    description:
      "Heavy-duty hydraulic tools for construction and manufacturing.",
    image:
      "https://images.unsplash.com/photo-1580889192556-fb4b8ab3d63b?w=400&h=300&fit=crop",
    origin: "Sweden",
  },
  {
    id: 8,
    name: "Metric Bolt Assortment",
    category: "Fasteners",
    description:
      "Complete metric bolt collection with nuts and washers included.",
    image:
      "https://images.unsplash.com/photo-1558618047-f4b511b10a74?w=400&h=300&fit=crop",
    origin: "Germany",
  },
  {
    id: 9,
    name: "Professional Wrench Set",
    category: "Hand Tools",
    description: "Chrome vanadium wrench set covering all standard sizes.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    origin: "USA",
  },
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All Products" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Our Products
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Premium Hardware Products
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Quality hardware and industrial supplies sourced from certified
              manufacturers worldwide.
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
                  onClick={() => setActiveCategory(category)}
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

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">
                        {product.category}
                      </span>
                      <span className="px-3 py-1 bg-accent/10 rounded-full text-xs font-medium text-accent">
                        {product.origin}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {product.description}
                    </p>
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
          ) : (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Sourcing CTA */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Can't Find What You Need?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              We specialize in custom sourcing. Tell us your requirements, and
              our team will find the perfect products from our network of
              verified suppliers.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="gap-2">
                Request Custom Sourcing
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
