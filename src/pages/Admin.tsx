import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Package, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getProducts,
  getBlogs,
  getTestimonials,
  addProduct,
  updateProduct,
  deleteProduct,
  addBlog,
  updateBlog,
  deleteBlog,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getHeroImage,
  setHeroImage,
  type Product,
  type Blog,
  type Testimonial,
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
  const [blogs, setBlogs] = useState<Blog[]>(getBlogs());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getTestimonials());
  const [heroImage, setHeroImageState] = useState<string>(getHeroImage());
  const [selectedHeroImage, setSelectedHeroImage] = useState<string>(getHeroImage());
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [testimonialImageFile, setTestimonialImageFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Reload data on component mount and when localStorage changes
  useEffect(() => {
    const reloadData = () => {
      setProducts(getProducts());
      setBlogs(getBlogs());
      setTestimonials(getTestimonials());
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

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    image: "",
    content: "",
  });

  // Testimonial form state
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    company: "",
    location: "",
    content: "",
    image: "",
    rating: 5,
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

  const handleBlogImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogImageFile(file);

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Store with unique key
        const imageKey = `blog_image_${Date.now()}_${file.name}`;
        if (typeof window !== "undefined") {
          localStorage.setItem(imageKey, base64String);
        }
        setBlogForm({ ...blogForm, image: imageKey });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTestimonialImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setTestimonialImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const imageKey = `testimonial_image_${Date.now()}_${file.name}`;
        if (typeof window !== "undefined") {
          localStorage.setItem(imageKey, base64String);
        }
        setTestimonialForm({ ...testimonialForm, image: imageKey });
      };
      reader.readAsDataURL(file);
    }
  };

  // Hero Image handler
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
     if (!file) {
       console.warn("No file selected");
       return;
     }

     console.log("=== HERO IMAGE UPLOAD DEBUG ===");
     console.log("Filename:", file.name);
     console.log("File size:", file.size, "bytes", `(${(file.size / 1024).toFixed(2)}KB)`);
     console.log("File type:", file.type);
     console.log("Last modified:", new Date(file.lastModified).toLocaleString());

     // Validation
     const maxSize = 5 * 1024 * 1024; // 5MB
     const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

     if (file.size > maxSize) {
       toast({
         title: "File Too Large",
         description: `Max 5MB, your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
         variant: "destructive",
       });
       console.error("File size exceeds limit");
       return;
     }

     if (!allowedTypes.includes(file.type)) {
       toast({
         title: "Invalid File Type",
         description: `Type: ${file.type}. Use: JPEG, PNG, GIF, or WebP`,
         variant: "destructive",
       });
       console.error("Invalid file type:", file.type);
       return;
     }

     // Test localStorage access
     try {
       const testKey = "test_storage_" + Date.now();
       localStorage.setItem(testKey, "test");
       localStorage.removeItem(testKey);
       console.log("✓ localStorage is accessible");
     } catch (e) {
       toast({
         title: "Storage Error",
         description: "localStorage not accessible or quota exceeded",
         variant: "destructive",
       });
       console.error("localStorage test failed:", e);
       return;
     }

      setHeroImageFile(file);

      // Convert image to base64
      const reader = new FileReader();
      reader.onerror = () => {
         console.error("FileReader error:", reader.error);
        toast({
           title: "Read Error",
           description: "Failed to read file. Try a different image.",
          variant: "destructive",
        });
      };
       reader.onprogress = (event) => {
         if (event.lengthComputable) {
           const percentComplete = (event.loaded / event.total) * 100;
           console.log("Read progress:", percentComplete.toFixed(2) + "%");
         }
       };
      reader.onload = () => {
         try {
        const base64String = reader.result as string;

           if (!base64String) {
             console.error("Failed to generate base64 string");
             toast({
               title: "Conversion Error",
               description: "Failed to convert image. Try a different image.",
               variant: "destructive",
             });
             return;
           }

           console.log("✓ Base64 generated, length:", base64String.length);

        const imageKey = `hero_image_${Date.now()}_${file.name}`;
           console.log("Storage key:", imageKey);

           // Save to localStorage
           try {
             const storageBefore = Object.keys(localStorage).length;
             console.log("localStorage items before:", storageBefore);

          localStorage.setItem(imageKey, base64String);

             const storageAfter = Object.keys(localStorage).length;
             console.log("✓ Saved to localStorage");
             console.log("localStorage items after:", storageAfter);

             // Verify it was saved
             const retrieved = localStorage.getItem(imageKey);
             if (retrieved === base64String) {
               console.log("✓ Verification passed - image successfully stored");
          setSelectedHeroImage(imageKey);
          toast({
            title: "Success",
            description: `Uploaded: ${file.name} - Click "Update Hero Image" to save`,
          });

               // Reset input
               if (e.target) {
                 e.target.value = "";
               }
             } else {
               console.error("✗ Verification failed - data mismatch");
               console.error("Expected length:", base64String.length);
               console.error("Retrieved length:", retrieved?.length || 0);
               toast({
                 title: "Verification Error",
                 description: "Image was not saved correctly. Try again.",
                 variant: "destructive",
               });
             }
           } catch (storageError) {
             console.error("Storage error:", storageError);
             if (storageError instanceof Error) {
               console.error("Error name:", storageError.name);
               console.error("Error message:", storageError.message);

               if (storageError.name === "QuotaExceededError") {
                 toast({
                   title: "Storage Full",
                   description: "Delete old images first or clear browser data.",
                   variant: "destructive",
                 });
               } else {
                 toast({
                   title: "Storage Error",
                   description: storageError.message,
                   variant: "destructive",
                 });
               }
             }
           }
         } catch (error) {
           console.error("Processing error:", error);
           toast({
             title: "Processing Error",
             description: "Error processing image. Try again.",
             variant: "destructive",
           });
        }
      };
       console.log("Starting file read as Data URL...");
      reader.readAsDataURL(file);
  };

  const handleSaveHeroImage = () => {
    if (selectedHeroImage && selectedHeroImage.startsWith("hero_image_")) {
      setHeroImage(selectedHeroImage);
      setHeroImageState(selectedHeroImage);
      toast({
        title: "Hero Image Updated",
        description: "The hero image has been successfully updated.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please upload an image first.",
        variant: "destructive",
      });
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

  // Blog handlers
  const handleAddBlog = () => {
    setEditingBlog(null);
    setBlogImageFile(null);
    setBlogForm({
      image: "",
      content: "",
    });
    setBlogDialogOpen(true);
  };

  // Testimonial handlers
  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialImageFile(null);
    setTestimonialForm({
      name: "",
      role: "",
      company: "",
      location: "",
      content: "",
      image: "",
      rating: 5,
    });
    setTestimonialDialogOpen(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      location: testimonial.location,
      content: testimonial.content,
      image: testimonial.image || "",
      rating: testimonial.rating || 5,
    });
    setTestimonialDialogOpen(true);
  };

  const handleDeleteTestimonial = (id: number) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonial(id);
      setTestimonials(getTestimonials());
      toast({
        title: "Testimonial Deleted",
        description: "The testimonial has been successfully deleted.",
      });
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogForm({
      image: blog.image,
      content: blog.content,
    });
    setBlogDialogOpen(true);
  };

  const handleDeleteBlog = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteBlog(id);
      setBlogs(getBlogs());
      toast({
        title: "Blog Deleted",
        description: "The blog has been successfully deleted.",
      });
    }
  };

  const handleSaveBlog = () => {
    if (!blogForm.image || !blogForm.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingBlog) {
      updateBlog(editingBlog.id, {
        image: blogForm.image,
        content: blogForm.content,
      });
      toast({
        title: "Blog Updated",
        description: "The blog has been successfully updated.",
      });
    } else {
      addBlog({
        image: blogForm.image,
        content: blogForm.content,
      });
      toast({
        title: "Blog Added",
        description: "The blog has been successfully added.",
      });
    }

    setBlogs(getBlogs());
    setBlogDialogOpen(false);
    setBlogImageFile(null);
  };

  const handleSaveTestimonial = () => {
    if (
      !testimonialForm.name ||
      !testimonialForm.role ||
      !testimonialForm.company ||
      !testimonialForm.location ||
      !testimonialForm.content
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, {
        name: testimonialForm.name,
        role: testimonialForm.role,
        company: testimonialForm.company,
        location: testimonialForm.location,
        content: testimonialForm.content,
        image: testimonialForm.image || undefined,
        rating: testimonialForm.rating,
      });
      toast({
        title: "Testimonial Updated",
        description: "The testimonial has been successfully updated.",
      });
    } else {
      addTestimonial({
        name: testimonialForm.name,
        role: testimonialForm.role,
        company: testimonialForm.company,
        location: testimonialForm.location,
        content: testimonialForm.content,
        image: testimonialForm.image || undefined,
        rating: testimonialForm.rating,
      });
      toast({
        title: "Testimonial Added",
        description: "The testimonial has been successfully added.",
      });
    }

    setTestimonials(getTestimonials());
    setTestimonialDialogOpen(false);
    setTestimonialImageFile(null);
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
              Manage products and blogs
            </p>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Hero Image Management */}
          <div className="mb-12 bg-card rounded-xl p-8 border border-border/50">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              Manage Hero Image
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="hero-image">Hero Image</Label>
                <Input
                  id="hero-image"
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="cursor-pointer mt-2"
                />
                {selectedHeroImage && selectedHeroImage.startsWith("hero_image_") && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    ✓ Image selected: {selectedHeroImage.split("_").pop()}
                  </p>
                )}
                {heroImage && heroImage !== selectedHeroImage && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Current: {heroImage.split("_").pop()}
                  </p>
                )}
                <Button 
                  onClick={handleSaveHeroImage} 
                  className="mt-4"
                  disabled={!selectedHeroImage || !selectedHeroImage.startsWith("hero_image_")}
                >
                  Update Hero Image
                </Button>
              </div>
              <div>
                <Label>Preview</Label>
                <div className="mt-2 bg-secondary rounded-lg overflow-hidden h-48">
                  <ImageDisplay
                    src={selectedHeroImage}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
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

            {/* Blogs Tab */}
            <TabsContent value="blogs">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Manage Blogs
                </h2>
                <Button onClick={handleAddBlog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog
                </Button>
              </div>

              <div className="grid gap-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-card rounded-xl p-6 border border-border/50 flex items-start gap-4"
                  >
                    <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                      <ImageDisplay
                        src={blog.image}
                        alt="Blog"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground line-clamp-3">
                        {blog.content}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBlog(blog)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Manage Testimonials
                </h2>
                <Button onClick={handleAddTestimonial}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>

              <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-card rounded-xl p-6 border border-border/50 flex items-start gap-4"
                  >
                    {testimonial.image ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                        <ImageDisplay
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-heading font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                          {testimonial.role}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.company} • {testimonial.location}
                      </p>
                      <p className="text-sm text-foreground mt-2 line-clamp-3">
                        {testimonial.content}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTestimonial(testimonial)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
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

      {/* Blog Dialog */}
      <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlog ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="blog-image">Blog Image *</Label>
              <Input
                id="blog-image"
                type="file"
                accept="image/*"
                onChange={handleBlogImageUpload}
                className="cursor-pointer"
              />
              {blogForm.image && (
                <p className="text-sm text-muted-foreground mt-1">
                  Path: {blogForm.image}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="content">Blog Content *</Label>
              <Textarea
                id="content"
                value={blogForm.content}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, content: e.target.value })
                }
                placeholder="Write your blog content here..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBlogDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveBlog}>
              {editingBlog ? "Update" : "Add"} Blog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testimonial-name">Name *</Label>
                <Input
                  id="testimonial-name"
                  value={testimonialForm.name}
                  onChange={(e) =>
                    setTestimonialForm({ ...testimonialForm, name: e.target.value })
                  }
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <Label htmlFor="testimonial-role">Role *</Label>
                <Input
                  id="testimonial-role"
                  value={testimonialForm.role}
                  onChange={(e) =>
                    setTestimonialForm({ ...testimonialForm, role: e.target.value })
                  }
                  placeholder="Interior Designer"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testimonial-company">Company *</Label>
                <Input
                  id="testimonial-company"
                  value={testimonialForm.company}
                  onChange={(e) =>
                    setTestimonialForm({ ...testimonialForm, company: e.target.value })
                  }
                  placeholder="Design Studio"
                />
              </div>
              <div>
                <Label htmlFor="testimonial-location">Location *</Label>
                <Input
                  id="testimonial-location"
                  value={testimonialForm.location}
                  onChange={(e) =>
                    setTestimonialForm({ ...testimonialForm, location: e.target.value })
                  }
                  placeholder="London, UK"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="testimonial-rating">Rating (1-5)</Label>
              <Input
                id="testimonial-rating"
                type="number"
                min={1}
                max={5}
                value={testimonialForm.rating}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    rating: Number(e.target.value) || 5,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="testimonial-image">Author Image (optional)</Label>
              <Input
                id="testimonial-image"
                type="file"
                accept="image/*"
                onChange={handleTestimonialImageUpload}
                className="cursor-pointer"
              />
              {testimonialForm.image && (
                <p className="text-sm text-muted-foreground mt-1">
                  Stored as: {testimonialForm.image}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="testimonial-content">Testimonial *</Label>
              <Textarea
                id="testimonial-content"
                value={testimonialForm.content}
                onChange={(e) =>
                  setTestimonialForm({ ...testimonialForm, content: e.target.value })
                }
                placeholder="Write the testimonial here..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTestimonialDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTestimonial}>
              {editingTestimonial ? "Update" : "Add"} Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
};

export default Admin;
