import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Package, FileText } from "lucide-react";
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

const Admin = () => {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(getCaseStudies());
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

  // Reload data on component mount and when localStorage changes
  useEffect(() => {
    const reloadData = () => {
      setProducts(getProducts());
      setCaseStudies(getCaseStudies());
    };

    // Reload on mount
    reloadData();

    // Listen for storage changes from other tabs/windows
    window.addEventListener("storage", reloadData);

    // Custom event for same-tab updates
    window.addEventListener("dataUpdated", reloadData);

    return () => {
      window.removeEventListener("storage", reloadData);
      window.removeEventListener("dataUpdated", reloadData);
    };
  }, []);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    image: "",
    finishes: [] as string[],
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

  // Image upload handlers
  const handleProductImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImageFile(file);

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Store with unique key
        const imageKey = `product_image_${Date.now()}_${file.name}`;
        if (typeof window !== "undefined") {
          localStorage.setItem(imageKey, base64String);
        }
        setProductForm({ ...productForm, image: imageKey });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaseStudyImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setCaseStudyImageFile(file);

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Store with unique key
        const imageKey = `casestudy_image_${Date.now()}_${file.name}`;
        if (typeof window !== "undefined") {
          localStorage.setItem(imageKey, base64String);
        }
        setCaseStudyForm({ ...caseStudyForm, image: imageKey });
      };
      reader.readAsDataURL(file);
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
      finishes: [],
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
      finishes: product.finishes || [],
    });
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      setProducts(getProducts());
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
      });
    }
  };

  const handleSaveProduct = () => {
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

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productForm.name,
        category: productForm.category,
        subcategory: productForm.subcategory,
        description: productForm.description,
        image: productForm.image,
        finishes: productForm.finishes,
      });
      toast({
        title: "Product Updated",
        description: "The product has been successfully updated.",
      });
    } else {
      addProduct({
        name: productForm.name,
        category: productForm.category,
        subcategory: productForm.subcategory,
        description: productForm.description,
        image: productForm.image,
        finishes: productForm.finishes,
      });
      toast({
        title: "Product Added",
        description: "The product has been successfully added.",
      });
    }

    setProducts(getProducts());
    setProductDialogOpen(false);
    setProductImageFile(null);
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

  const handleDeleteCaseStudy = (id: number) => {
    if (window.confirm("Are you sure you want to delete this case study?")) {
      deleteCaseStudy(id);
      setCaseStudies(getCaseStudies());
      toast({
        title: "Case Study Deleted",
        description: "The case study has been successfully deleted.",
      });
    }
  };

  const handleSaveCaseStudy = () => {
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

    if (editingCaseStudy) {
      updateCaseStudy(editingCaseStudy.id, {
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
      addCaseStudy({
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

    setCaseStudies(getCaseStudies());
    setCaseStudyDialogOpen(false);
    setCaseStudyImageFile(null);
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
              />
              {productForm.image && (
                <p className="text-sm text-muted-foreground mt-1">
                  Path: {productForm.image}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="finishes">Available Finishes (optional)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableFinishes.map((finish) => (
                  <label
                    key={finish}
                    className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={productForm.finishes.includes(finish)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProductForm({
                            ...productForm,
                            finishes: [...productForm.finishes, finish],
                          });
                        } else {
                          setProductForm({
                            ...productForm,
                            finishes: productForm.finishes.filter(
                              (f) => f !== finish
                            ),
                          });
                        }
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{finish}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? "Update" : "Add"} Product
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
              />
              {caseStudyForm.image && (
                <p className="text-sm text-muted-foreground mt-1">
                  Path: {caseStudyForm.image}
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
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCaseStudy}>
              {editingCaseStudy ? "Update" : "Add"} Case Study
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
};

export default Admin;
