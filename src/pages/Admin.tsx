import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Package, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getProducts,
  getCaseStudies,
  addProduct,
  updateProduct,
  deleteProduct,
  addCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  type Product,
  type CaseStudy,
} from "@/lib/data";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productCategories = ["Knobs", "Door Handles", "Pull Handles"];
const caseStudyCategories = ["Export", "Import", "Logistics", "Consulting"];

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [caseStudyDialogOpen, setCaseStudyDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(
    null
  );
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [caseStudyImageFile, setCaseStudyImageFile] = useState<File | null>(
    null
  );
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, caseStudiesData] = await Promise.all([
          getProducts(),
          getCaseStudies(),
        ]);
        setProducts(productsData);
        setCaseStudies(caseStudiesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data from Redis. Please check your configuration.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    image: "",
    finishes: "",
  });

  // Case Study form state
  const [caseStudyForm, setCaseStudyForm] = useState({
    title: "",
    client: "",
    category: "",
    location: "",
    image: "",
    problem: "",
    solution: "",
    outcome: "",
    stats: "",
  });

  // Image upload handlers with Cloudinary
  const handleProductImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImageFile(file);
      setUploading(true);

      try {
        const result = await uploadImageToCloudinary(file);
        setProductForm({ ...productForm, image: result.secure_url });
        toast({
          title: "Image Uploaded",
          description: "Image uploaded successfully to Cloudinary.",
        });
      } catch (error) {
        console.error("Image upload error:", error);
        toast({
          title: "Upload Error",
          description: error instanceof Error ? error.message : "Failed to upload image",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCaseStudyImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setCaseStudyImageFile(file);
      setUploading(true);

      try {
        const result = await uploadImageToCloudinary(file);
        setCaseStudyForm({ ...caseStudyForm, image: result.secure_url });
        toast({
          title: "Image Uploaded",
          description: "Image uploaded successfully to Cloudinary.",
        });
      } catch (error) {
        console.error("Image upload error:", error);
        toast({
          title: "Upload Error",
          description: error instanceof Error ? error.message : "Failed to upload image",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  // Product handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductImageFile(null);
    setProductForm({
      name: "",
      category: "",
      subcategory: "",
      description: "",
      image: "",
      finishes: "",
    });
    setProductDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || "",
      description: product.description,
      image: product.image,
      finishes: product.finishes.join(", "),
    });
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await deleteProduct(id);
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
        toast({
          title: "Product Deleted",
          description: "The product has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProduct = async () => {
    const finishesArray = productForm.finishes
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);

    if (
      !productForm.name ||
      !productForm.category ||
      !productForm.description
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: productForm.name,
          category: productForm.category,
          subcategory: productForm.subcategory,
          description: productForm.description,
          image: productForm.image,
          finishes: finishesArray,
        });
        toast({
          title: "Product Updated",
          description: "The product has been successfully updated.",
        });
      } else {
        await addProduct({
          name: productForm.name,
          category: productForm.category,
          subcategory: productForm.subcategory,
          description: productForm.description,
          image: productForm.image,
          finishes: finishesArray,
        });
        toast({
          title: "Product Added",
          description: "The product has been successfully added.",
        });
      }

      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setProductDialogOpen(false);
      setProductImageFile(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Case Study handlers
  const handleAddCaseStudy = () => {
    setEditingCaseStudy(null);
    setCaseStudyImageFile(null);
    setCaseStudyForm({
      title: "",
      client: "",
      category: "",
      location: "",
      image: "",
      problem: "",
      solution: "",
      outcome: "",
      stats: "",
    });
    setCaseStudyDialogOpen(true);
  };

  const handleEditCaseStudy = (caseStudy: CaseStudy) => {
    setEditingCaseStudy(caseStudy);
    setCaseStudyForm({
      title: caseStudy.title,
      client: caseStudy.client,
      category: caseStudy.category,
      location: caseStudy.location,
      image: caseStudy.image,
      problem: caseStudy.problem,
      solution: caseStudy.solution,
      outcome: caseStudy.outcome,
      stats: caseStudy.stats.map((s) => `${s.label}:${s.value}`).join(", "),
    });
    setCaseStudyDialogOpen(true);
  };

  const handleDeleteCaseStudy = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this case study?")) {
      try {
        setLoading(true);
        await deleteCaseStudy(id);
        const updatedCaseStudies = await getCaseStudies();
        setCaseStudies(updatedCaseStudies);
        toast({
          title: "Case Study Deleted",
          description: "The case study has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting case study:", error);
        toast({
          title: "Error",
          description: "Failed to delete case study.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveCaseStudy = async () => {
    const statsArray = caseStudyForm.stats
      .split(",")
      .map((s) => {
        const [label, value] = s.split(":").map((p) => p.trim());
        return { label, value };
      })
      .filter((s) => s.label && s.value);

    if (
      !caseStudyForm.title ||
      !caseStudyForm.client ||
      !caseStudyForm.category ||
      !caseStudyForm.problem
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (editingCaseStudy) {
        await updateCaseStudy(editingCaseStudy.id, {
          title: caseStudyForm.title,
          client: caseStudyForm.client,
          category: caseStudyForm.category,
          location: caseStudyForm.location,
          image: caseStudyForm.image,
          problem: caseStudyForm.problem,
          solution: caseStudyForm.solution,
          outcome: caseStudyForm.outcome,
          stats: statsArray,
        });
        toast({
          title: "Case Study Updated",
          description: "The case study has been successfully updated.",
        });
      } else {
        await addCaseStudy({
          title: caseStudyForm.title,
          client: caseStudyForm.client,
          category: caseStudyForm.category,
          location: caseStudyForm.location,
          image: caseStudyForm.image,
          problem: caseStudyForm.problem,
          solution: caseStudyForm.solution,
          outcome: caseStudyForm.outcome,
          stats: statsArray,
        });
        toast({
          title: "Case Study Added",
          description: "The case study has been successfully added.",
        });
      }

      const updatedCaseStudies = await getCaseStudies();
      setCaseStudies(updatedCaseStudies);
      setCaseStudyDialogOpen(false);
      setCaseStudyImageFile(null);
    } catch (error) {
      console.error("Error saving case study:", error);
      toast({
        title: "Error",
        description: "Failed to save case study.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Admin Dashboard
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Manage products and case studies
            </p>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && (
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="caseStudies">Case Studies</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Manage Products
                </h2>
                <Button onClick={handleAddProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="grid gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-xl p-6 border border-border/50 flex items-start gap-4"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                      <ImageDisplay
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.category}
                        {product.subcategory && ` • ${product.subcategory}`}
                      </p>
                      <p className="text-sm text-foreground">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.finishes.map((finish, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground"
                          >
                            {finish}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Case Studies Tab */}
            <TabsContent value="caseStudies">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Manage Case Studies
                </h2>
                <Button onClick={handleAddCaseStudy}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Case Study
                </Button>
              </div>

              <div className="grid gap-4">
                {caseStudies.map((caseStudy) => (
                  <div
                    key={caseStudy.id}
                    className="bg-card rounded-xl p-6 border border-border/50 flex items-start gap-4"
                  >
                    <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                      <ImageDisplay
                        src={caseStudy.image}
                        alt={caseStudy.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                        {caseStudy.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {caseStudy.client} • {caseStudy.category}
                      </p>
                      <p className="text-sm text-foreground line-clamp-2">
                        {caseStudy.problem}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCaseStudy(caseStudy)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCaseStudy(caseStudy.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          )}
        </div>
      </section>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                placeholder="Classic Brass Knob"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) =>
                    setProductForm({ ...productForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={productForm.subcategory}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      subcategory: e.target.value,
                    })
                  }
                  placeholder="Brass Knobs"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                placeholder="Product description..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="image">Product Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleProductImageUpload}
                className="cursor-pointer"
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-primary mt-1 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading to Cloudinary...
                </p>
              )}
              {productForm.image && !uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  URL: {productForm.image}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="finishes">Finishes (comma-separated)</Label>
              <Textarea
                id="finishes"
                value={productForm.finishes}
                onChange={(e) =>
                  setProductForm({ ...productForm, finishes: e.target.value })
                }
                placeholder="Brass, PVD Satin Gold, PVD Polished Copper"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductDialogOpen(false)}
              disabled={uploading || loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} disabled={uploading || loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                `${editingProduct ? "Update" : "Add"} Product`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Case Study Dialog */}
      <Dialog open={caseStudyDialogOpen} onOpenChange={setCaseStudyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCaseStudy ? "Edit Case Study" : "Add New Case Study"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={caseStudyForm.title}
                onChange={(e) =>
                  setCaseStudyForm({ ...caseStudyForm, title: e.target.value })
                }
                placeholder="Project Title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client *</Label>
                <Input
                  id="client"
                  value={caseStudyForm.client}
                  onChange={(e) =>
                    setCaseStudyForm({
                      ...caseStudyForm,
                      client: e.target.value,
                    })
                  }
                  placeholder="Client Name"
                />
              </div>
              <div>
                <Label htmlFor="cs-category">Category *</Label>
                <Select
                  value={caseStudyForm.category}
                  onValueChange={(value) =>
                    setCaseStudyForm({ ...caseStudyForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseStudyCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={caseStudyForm.location}
                onChange={(e) =>
                  setCaseStudyForm({
                    ...caseStudyForm,
                    location: e.target.value,
                  })
                }
                placeholder="Country A → Country B"
              />
            </div>
            <div>
              <Label htmlFor="cs-image">Case Study Image</Label>
              <Input
                id="cs-image"
                type="file"
                accept="image/*"
                onChange={handleCaseStudyImageUpload}
                className="cursor-pointer"
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-primary mt-1 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading to Cloudinary...
                </p>
              )}
              {caseStudyForm.image && !uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  URL: {caseStudyForm.image}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="problem">Problem *</Label>
              <Textarea
                id="problem"
                value={caseStudyForm.problem}
                onChange={(e) =>
                  setCaseStudyForm({
                    ...caseStudyForm,
                    problem: e.target.value,
                  })
                }
                placeholder="Describe the problem..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="solution">Solution</Label>
              <Textarea
                id="solution"
                value={caseStudyForm.solution}
                onChange={(e) =>
                  setCaseStudyForm({
                    ...caseStudyForm,
                    solution: e.target.value,
                  })
                }
                placeholder="Describe the solution..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="outcome">Outcome</Label>
              <Textarea
                id="outcome"
                value={caseStudyForm.outcome}
                onChange={(e) =>
                  setCaseStudyForm({
                    ...caseStudyForm,
                    outcome: e.target.value,
                  })
                }
                placeholder="Describe the outcome..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="stats">
                Stats (format: Label:Value, Label:Value)
              </Label>
              <Textarea
                id="stats"
                value={caseStudyForm.stats}
                onChange={(e) =>
                  setCaseStudyForm({ ...caseStudyForm, stats: e.target.value })
                }
                placeholder="Sales Increase:300%, Countries Covered:8"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCaseStudyDialogOpen(false)}
              disabled={uploading || loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCaseStudy} disabled={uploading || loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                `${editingCaseStudy ? "Update" : "Add"} Case Study`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
};

export default Admin;
