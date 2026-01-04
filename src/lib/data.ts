// Shared data store for products and case studies

// Taxonomy interfaces
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  description?: string;
}

export interface Material {
  id: number;
  name: string;
  categoryId?: number; // Optional: link to specific category
  subcategoryId?: number; // Optional: link to specific subcategory
  description?: string;
}

export interface FinishCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Finish {
  id: number;
  name: string;
  categoryId: number; // Link to FinishCategory
  image: string; // Path or key to finish image
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string; // Keep as string for backward compatibility
  categoryId?: number; // New: reference to Category
  subcategory?: string; // Keep as string for backward compatibility
  subcategoryId?: number; // New: reference to Subcategory
  material: string; // Keep as string for backward compatibility
  materialId?: number; // New: reference to Material
  description: string;
  modelNumber?: string; // Product model number
  longDescription?: string; // Detailed product description
  image: string;
  finishes: string[]; // Keep as string array for backward compatibility
  finishIds?: number[]; // New: references to Finish
}

export interface Blog {
  id: number;
  image: string;
  content: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  content: string;
  image?: string;
  rating?: number;
}

// Legacy interface kept for backwards compatibility
export interface CaseStudy {
  id: number;
  title: string;
  client: string;
  category: string;
  location: string;
  image: string;
  problem: string;
  solution: string;
  outcome: string;
  stats: { label: string; value: string }[];
}

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Classic Brass Knob",
    category: "Knob",
    material: "Brass",
    description:
      "Timeless brass knob with exceptional craftsmanship and warm golden finish.",
    image: "/images/products/knobs/brassknob1.jpg",
    finishes: ["Brass", "PVD Satin Gold", "PVD Polished Copper"],
  },
  {
    id: 2,
    name: "Stainless Steel Knob",
    category: "Knob",
    material: "Stainless Steel",
    description:
      "Modern metal knob with premium finishes for contemporary interiors.",
    image: "/images/products/knobs/metal-knob-1.jpg",
    finishes: [
      "Polished Stainless Steel",
      "Satin Stainless Steel",
      "Satin Nickel",
    ],
  },
  {
    id: 3,
    name: "Architectural Cabinet Handle",
    category: "Door Handle",
    subcategory: "Cabinet Handle",
    material: "Stainless Steel",
    description:
      "Precision-engineered cabinet handle with ergonomic design and multiple finish options.",
    image: "/images/products/door-handles/door-handle-1.jpg",
    finishes: ["PVD Satin Black", "PVD Satin Bronze", "Satin Black"],
  },
  {
    id: 4,
    name: "Contemporary Cabinet Handle",
    category: "Door Handle",
    subcategory: "Cabinet Handle",
    material: "Brass",
    description:
      "Sleek brass cabinet handle combining functionality with minimalist aesthetics.",
    image: "/images/products/door-handles/door-handle-2.jpg",
    finishes: ["Brass", "PVD Satin Gold", "PVD Polished Copper"],
  },
  {
    id: 5,
    name: "Premium Door Handle",
    category: "Door Handle",
    subcategory: "Door Handle",
    material: "Stainless Steel",
    description:
      "Robust door handle perfect for entrance doors and commercial applications.",
    image: "/images/products/pull-handles/pull-handle-1.jpg",
    finishes: ["PVD Satin Stainless Steel", "PVD Satin Black", "Satin Stainless Steel"],
  },
  {
    id: 6,
    name: "Designer Door Handle",
    category: "Door Handle",
    subcategory: "Door Handle",
    material: "Brass",
    description:
      "Statement door handle with architectural presence and luxurious finishes.",
    image: "/images/products/pull-handles/pull-handle-2.jpg",
    finishes: ["Brass", "PVD Satin Gold", "PVD Satin Bronze", "PVD Polished Copper"],
  },
];

const defaultBlogs: Blog[] = [];

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "David Richardson",
    role: "Lead Architect",
    company: "Richardson & Partners",
    location: "London, UK",
    image: "/images/testimonials/client-1.jpg",
    content:
      "Hindonix hardware has become our go-to specification for luxury residential projects. The PVD finishes are exceptional and the quality is consistently outstanding.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    role: "Interior Designer",
    company: "Mitchell Design Studio",
    location: "Dubai, UAE",
    image: "/images/testimonials/client-2.jpg",
    content:
      "The attention to detail in Hindonix products is remarkable. Their brass knobs and door handles add that perfect finishing touch to our high-end projects.",
    rating: 5,
  },
  {
    id: 3,
    name: "James Thompson",
    role: "Project Manager",
    company: "Thompson Construction",
    location: "Manchester, UK",
    image: "/images/testimonials/client-3.jpg",
    content:
      "Reliable delivery and consistent quality. Hindonix has never let us down on our commercial projects. Their range of finishes meets all our specification needs.",
    rating: 5,
  },
  {
    id: 4,
    name: "Fatima Al-Mansoori",
    role: "Procurement Director",
    company: "Al-Mansoori Developments",
    location: "Abu Dhabi, UAE",
    image: "/images/testimonials/client-4.jpg",
    content:
      "Outstanding B2B partnership. Hindonix understands the demands of large-scale projects and delivers premium hardware that exceeds expectations every time.",
    rating: 5,
  },
];

const defaultCaseStudies: CaseStudy[] = [];

// Default taxonomy data
const defaultCategories: Category[] = [
  { id: 1, name: "Knob", description: "Door and cabinet knobs" },
  { id: 2, name: "Door Handle", description: "Various types of door handles" },
];

const defaultSubcategories: Subcategory[] = [
  { id: 1, name: "Cabinet Handle", categoryId: 2, description: "Handles for cabinets" },
  { id: 2, name: "Door Handle", categoryId: 2, description: "Handles for doors" },
];

const defaultMaterials: Material[] = [
  { id: 1, name: "Stainless Steel", description: "Premium stainless steel" },
  { id: 2, name: "Brass", description: "High-quality brass" },
];

const defaultFinishCategories: FinishCategory[] = [
  { id: 1, name: "Stainless Steel Finish", description: "Finishes for stainless steel products" },
  { id: 2, name: "Brass Finish", description: "Finishes for brass products" },
  { id: 3, name: "PVD Finish", description: "Physical Vapor Deposition finishes" },
];

const defaultFinishes: Finish[] = [
  { id: 1, name: "Matt", categoryId: 1, image: "/images/finishes/matt.jpg" },
  { id: 2, name: "Glossy Chrome", categoryId: 1, image: "/images/finishes/glossy-chrome.jpg" },
  { id: 3, name: "Satin", categoryId: 1, image: "/images/finishes/satin-stainless-steel.jpg" },
  { id: 4, name: "Black Satin", categoryId: 1, image: "/images/finishes/satin-black.jpg" },
  { id: 5, name: "Brass Antique", categoryId: 2, image: "/images/finishes/brass.jpg" },
  { id: 6, name: "Rose Gold", categoryId: 3, image: "/images/finishes/pvd-rose-gold.jpg" },
  { id: 7, name: "Matte Black", categoryId: 3, image: "/images/finishes/pvd-satin-black.jpg" },
  { id: 8, name: "PVD Rose Gold", categoryId: 3, image: "/images/finishes/pvd-polished-copper.jpg" },
  { id: 9, name: "PVD Gold", categoryId: 3, image: "/images/finishes/pvd-satin-gold.jpg" },
  { id: 10, name: "PVD Bronze", categoryId: 3, image: "/images/finishes/pvd-satin-bronze.jpg" },
  { id: 11, name: "PVD Nickel", categoryId: 3, image: "/images/finishes/pvd-satin-nickel.jpg" },
];

// Initialize data from localStorage or use defaults
const loadProducts = (): Product[] => {
  if (typeof window === "undefined") return defaultProducts;
  const stored = localStorage.getItem("hindonix_products");
  return stored ? JSON.parse(stored) : defaultProducts;
};

const loadBlogs = (): Blog[] => {
  if (typeof window === "undefined") return defaultBlogs;
  const stored = localStorage.getItem("hindonix_blogs");
  return stored ? JSON.parse(stored) : defaultBlogs;
};

const loadTestimonials = (): Testimonial[] => {
  if (typeof window === "undefined") return defaultTestimonials;
  const stored = localStorage.getItem("hindonix_testimonials");
  return stored ? JSON.parse(stored) : defaultTestimonials;
};

const loadCaseStudies = (): CaseStudy[] => {
  if (typeof window === "undefined") return defaultCaseStudies;
  const stored = localStorage.getItem("hindonix_case_studies");
  return stored ? JSON.parse(stored) : defaultCaseStudies;
};

// Taxonomy loaders
const loadCategories = (): Category[] => {
  if (typeof window === "undefined") return defaultCategories;
  const stored = localStorage.getItem("hindonix_categories");
  return stored ? JSON.parse(stored) : defaultCategories;
};

const loadSubcategories = (): Subcategory[] => {
  if (typeof window === "undefined") return defaultSubcategories;
  const stored = localStorage.getItem("hindonix_subcategories");
  return stored ? JSON.parse(stored) : defaultSubcategories;
};

const loadMaterials = (): Material[] => {
  if (typeof window === "undefined") return defaultMaterials;
  const stored = localStorage.getItem("hindonix_materials");
  return stored ? JSON.parse(stored) : defaultMaterials;
};

const loadFinishes = (): Finish[] => {
  if (typeof window === "undefined") return defaultFinishes;
  const stored = localStorage.getItem("hindonix_finishes");
  return stored ? JSON.parse(stored) : defaultFinishes;
};

const loadFinishCategories = (): FinishCategory[] => {
  if (typeof window === "undefined") return defaultFinishCategories;
  const stored = localStorage.getItem("hindonix_finish_categories");
  return stored ? JSON.parse(stored) : defaultFinishCategories;
};

const saveProducts = (products: Product[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hindonix_products", JSON.stringify(products));
    window.dispatchEvent(new Event("dataUpdated"));
  }
};

const saveBlogs = (blogs: Blog[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hindonix_blogs", JSON.stringify(blogs));
    window.dispatchEvent(new Event("dataUpdated"));
  }
};

const saveTestimonials = (testimonials: Testimonial[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hindonix_testimonials", JSON.stringify(testimonials));
    window.dispatchEvent(new Event("dataUpdated"));
  }
};

const saveCaseStudies = (caseStudies: CaseStudy[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hindonix_case_studies", JSON.stringify(caseStudies));
    window.dispatchEvent(new Event("dataUpdated"));
  }
};

// Taxonomy savers
const saveCategories = (categories: Category[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hindonix_categories", JSON.stringify(categories));
    window.dispatchEvent(new Event("dataUpdated"));
  }
};

const saveSubcategories = (subcategories: Subcategory[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hindonix_subcategories", JSON.stringify(subcategories));
    window.dispatchEvent(new Event("dataUpdated"));
  }
};

const saveMaterials = (materials: Material[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hindonix_materials", JSON.stringify(materials));
    window.dispatchEvent(new Event("dataUpdated"));
  }
};

const saveFinishes = (finishes: Finish[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hindonix_finishes", JSON.stringify(finishes));
    window.dispatchEvent(new Event("dataUpdated"));
  }
};

const saveFinishCategories = (finishCategories: FinishCategory[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hindonix_finish_categories", JSON.stringify(finishCategories));
    window.dispatchEvent(new Event("dataUpdated"));
  }
};

let products: Product[] = loadProducts();
let blogs: Blog[] = loadBlogs();
let testimonials: Testimonial[] = loadTestimonials();
let caseStudies: CaseStudy[] = loadCaseStudies();
let categories: Category[] = loadCategories();
let subcategories: Subcategory[] = loadSubcategories();
let materials: Material[] = loadMaterials();
let finishes: Finish[] = loadFinishes();
let finishCategories: FinishCategory[] = loadFinishCategories();

// Product management functions
export const getProducts = (): Product[] => {
  products = loadProducts();
  return products;
};

export const addProduct = (product: Omit<Product, "id">): Product => {
  const newProduct = { ...product, id: Date.now() };
  products = [...products, newProduct];
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (
  id: number,
  updates: Partial<Product>
): Product | null => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
};

export const deleteProduct = (id: number): boolean => {
  const initialLength = products.length;
  products = products.filter((p) => p.id !== id);
  saveProducts(products);
  return products.length < initialLength;
};

// Blog management functions
export const getBlogs = (): Blog[] => {
  blogs = loadBlogs();
  return blogs;
};

export const addBlog = (blog: Omit<Blog, "id">): Blog => {
  const newBlog = { ...blog, id: Date.now() };
  blogs = [...blogs, newBlog];
  saveBlogs(blogs);
  return newBlog;
};

export const updateBlog = (id: number, updates: Partial<Blog>): Blog | null => {
  const index = blogs.findIndex((b) => b.id === id);
  if (index === -1) return null;
  blogs[index] = { ...blogs[index], ...updates };
  saveBlogs(blogs);
  return blogs[index];
};

export const deleteBlog = (id: number): boolean => {
  const initialLength = blogs.length;
  blogs = blogs.filter((b) => b.id !== id);
  saveBlogs(blogs);
  return blogs.length < initialLength;
};

// Testimonial management functions
export const getTestimonials = (): Testimonial[] => {
  testimonials = loadTestimonials();
  return testimonials;
};

export const addTestimonial = (
  testimonial: Omit<Testimonial, "id">
): Testimonial => {
  const newTestimonial = { ...testimonial, id: Date.now() };
  testimonials = [...testimonials, newTestimonial];
  saveTestimonials(testimonials);
  return newTestimonial;
};

export const updateTestimonial = (
  id: number,
  updates: Partial<Testimonial>
): Testimonial | null => {
  const index = testimonials.findIndex((t) => t.id === id);
  if (index === -1) return null;
  testimonials[index] = { ...testimonials[index], ...updates };
  saveTestimonials(testimonials);
  return testimonials[index];
};

export const deleteTestimonial = (id: number): boolean => {
  const initialLength = testimonials.length;
  testimonials = testimonials.filter((t) => t.id !== id);
  saveTestimonials(testimonials);
  return testimonials.length < initialLength;
};

// Case Study management functions
export const getCaseStudies = (): CaseStudy[] => {
  caseStudies = loadCaseStudies();
  return caseStudies;
};

export const addCaseStudy = (caseStudy: Omit<CaseStudy, "id">): CaseStudy => {
  const newCaseStudy = { ...caseStudy, id: Date.now() };
  caseStudies = [...caseStudies, newCaseStudy];
  saveCaseStudies(caseStudies);
  return newCaseStudy;
};

export const updateCaseStudy = (
  id: number,
  updates: Partial<CaseStudy>
): CaseStudy | null => {
  const index = caseStudies.findIndex((cs) => cs.id === id);
  if (index === -1) return null;
  caseStudies[index] = { ...caseStudies[index], ...updates };
  saveCaseStudies(caseStudies);
  return caseStudies[index];
};

export const deleteCaseStudy = (id: number): boolean => {
  const initialLength = caseStudies.length;
  caseStudies = caseStudies.filter((cs) => cs.id !== id);
  saveCaseStudies(caseStudies);
  return caseStudies.length < initialLength;
};

// Hero Image management
const HERO_IMAGE_KEY = "hindonix_hero_image";
const DEFAULT_HERO_IMAGE = "/images/hero/hero-1.jpg";

export const getHeroImage = (): string => {
  if (typeof window === "undefined") return DEFAULT_HERO_IMAGE;
  const stored = localStorage.getItem(HERO_IMAGE_KEY);
  return stored || DEFAULT_HERO_IMAGE;
};

export const setHeroImage = (imageKey: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(HERO_IMAGE_KEY, imageKey);
    window.dispatchEvent(new Event("heroImageUpdated"));
  }
};

// ========================================
// Taxonomy Management Functions
// ========================================

// Category management
export const getCategories = (): Category[] => {
  categories = loadCategories();
  return categories;
};

export const addCategory = (category: Omit<Category, "id">): Category => {
  const newCategory = { ...category, id: Date.now() };
  categories = [...categories, newCategory];
  saveCategories(categories);
  return newCategory;
};

export const updateCategory = (id: number, updates: Partial<Category>): Category | null => {
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...updates };
  saveCategories(categories);
  return categories[index];
};

export const deleteCategory = (id: number): boolean => {
  // Check if category has products
  const hasProducts = products.some((p) => p.categoryId === id || p.category === categories.find(c => c.id === id)?.name);
  if (hasProducts) {
    return false; // Cannot delete category with products
  }
  
  // Delete associated subcategories and materials
  subcategories = subcategories.filter((s) => s.categoryId !== id);
  saveSubcategories(subcategories);
  materials = materials.filter((m) => m.categoryId !== id);
  saveMaterials(materials);
  
  const initialLength = categories.length;
  categories = categories.filter((c) => c.id !== id);
  saveCategories(categories);
  return categories.length < initialLength;
};

// Subcategory management
export const getSubcategories = (): Subcategory[] => {
  subcategories = loadSubcategories();
  return subcategories;
};

export const addSubcategory = (subcategory: Omit<Subcategory, "id">): Subcategory => {
  const newSubcategory = { ...subcategory, id: Date.now() };
  subcategories = [...subcategories, newSubcategory];
  saveSubcategories(subcategories);
  return newSubcategory;
};

export const updateSubcategory = (id: number, updates: Partial<Subcategory>): Subcategory | null => {
  const index = subcategories.findIndex((s) => s.id === id);
  if (index === -1) return null;
  subcategories[index] = { ...subcategories[index], ...updates };
  saveSubcategories(subcategories);
  return subcategories[index];
};

export const deleteSubcategory = (id: number): boolean => {
  // Check if subcategory has products
  const hasProducts = products.some((p) => p.subcategoryId === id || p.subcategory === subcategories.find(s => s.id === id)?.name);
  if (hasProducts) {
    return false; // Cannot delete subcategory with products
  }
  
  // Delete associated materials
  materials = materials.filter((m) => m.subcategoryId !== id);
  saveMaterials(materials);
  
  const initialLength = subcategories.length;
  subcategories = subcategories.filter((s) => s.id !== id);
  saveSubcategories(subcategories);
  return subcategories.length < initialLength;
};

// Material management
export const getMaterials = (): Material[] => {
  materials = loadMaterials();
  return materials;
};

export const addMaterial = (material: Omit<Material, "id">): Material => {
  const newMaterial = { ...material, id: Date.now() };
  materials = [...materials, newMaterial];
  saveMaterials(materials);
  return newMaterial;
};

export const updateMaterial = (id: number, updates: Partial<Material>): Material | null => {
  const index = materials.findIndex((m) => m.id === id);
  if (index === -1) return null;
  materials[index] = { ...materials[index], ...updates };
  saveMaterials(materials);
  return materials[index];
};

export const deleteMaterial = (id: number): boolean => {
  // Check if material has products
  const hasMaterial = products.some((p) => p.materialId === id || p.material === materials.find(m => m.id === id)?.name);
  if (hasMaterial) {
    return false; // Cannot delete material with products
  }
  
  const initialLength = materials.length;
  materials = materials.filter((m) => m.id !== id);
  saveMaterials(materials);
  return materials.length < initialLength;
};

// Finish management
export const getFinishes = (): Finish[] => {
  finishes = loadFinishes();
  return finishes;
};

export const addFinish = (finish: Omit<Finish, "id">): Finish => {
  const newFinish = { ...finish, id: Date.now() };
  finishes = [...finishes, newFinish];
  saveFinishes(finishes);
  return newFinish;
};

export const updateFinish = (id: number, updates: Partial<Finish>): Finish | null => {
  const index = finishes.findIndex((f) => f.id === id);
  if (index === -1) return null;
  finishes[index] = { ...finishes[index], ...updates };
  saveFinishes(finishes);
  return finishes[index];
};

export const deleteFinish = (id: number): boolean => {
  // Note: We allow deleting finishes even if products use them
  // Products will retain finish names in their finishes array
  const initialLength = finishes.length;
  finishes = finishes.filter((f) => f.id !== id);
  saveFinishes(finishes);
  return finishes.length < initialLength;
};

// Finish Category management
export const getFinishCategories = (): FinishCategory[] => {
  finishCategories = loadFinishCategories();
  return finishCategories;
};

export const addFinishCategory = (category: Omit<FinishCategory, "id">): FinishCategory => {
  const newCategory = { ...category, id: Date.now() };
  finishCategories = [...finishCategories, newCategory];
  saveFinishCategories(finishCategories);
  return newCategory;
};

export const updateFinishCategory = (id: number, updates: Partial<FinishCategory>): FinishCategory | null => {
  const index = finishCategories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  finishCategories[index] = { ...finishCategories[index], ...updates };
  saveFinishCategories(finishCategories);
  return finishCategories[index];
};

export const deleteFinishCategory = (id: number): boolean => {
  // Check if category has finishes
  const hasFinishes = finishes.some((f) => f.categoryId === id);
  if (hasFinishes) {
    return false; // Cannot delete category with finishes
  }
  
  const initialLength = finishCategories.length;
  finishCategories = finishCategories.filter((c) => c.id !== id);
  saveFinishCategories(finishCategories);
  return finishCategories.length < initialLength;
};
