import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { getProducts, Product } from "@/lib/data";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const fromUrl = searchParams.get("from") || "/products";

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await getProducts();
        const foundProduct = products.find((p) => p.id === Number(id));
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          navigate("/products");
        }
      } catch (err) {
        // If fetching fails, return to products page
        navigate("/products");
      }
    };
    loadProduct();
  }, [id, navigate]);

  if (!product) {
    return null; // Loading state or redirect in progress
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Product Detail Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(fromUrl)}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Product Content */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Product Image */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border/50 aspect-square">
              <ImageDisplay
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col">
              {/* Category and Material Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
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

              {/* Product Name */}
              <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Model Number */}
              {product.modelNumber && (
                <p className="text-muted-foreground text-sm mb-6">
                  Model:{" "}
                  <span className="font-medium text-foreground">
                    {product.modelNumber}
                  </span>
                </p>
              )}

              {/* Short Description */}
              <div className="mb-6">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Long Description */}
              {product.longDescription && (
                <div className="mb-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground mb-2">
                    Details
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.longDescription}
                  </p>
                </div>
              )}

              {/* Available Finishes */}
              {product.finishes && product.finishes.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
                    Available Finishes
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.finishes.map((finish, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-foreground border border-border hover:border-accent transition-colors"
                      >
                        {finish}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Quote Button */}
              <div className="mt-auto">
                <Button size="lg" asChild className="w-full sm:w-auto gap-2">
                  <Link to="/contact">
                    Request Quote
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProductDetail;
