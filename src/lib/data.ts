// Shared data store for products and case studies
import { 
  getAllProducts, 
  addProductToRedis, 
  updateProductInRedis, 
  deleteProductFromRedis,
  getAllBlogs,
  addBlogToRedis,
  updateBlogInRedis,
  deleteBlogFromRedis,
  getAllTestimonials,
  addTestimonialToRedis,
  updateTestimonialInRedis,
  deleteTestimonialFromRedis,
  getAllCaseStudies,
  addCaseStudyToRedis,
  updateCaseStudyInRedis,
  deleteCaseStudyFromRedis,
  getAllCategories,
  addCategoryToRedis,
  updateCategoryInRedis,
  deleteCategoryFromRedis,
  getAllSubcategories,
  addSubcategoryToRedis,
  updateSubcategoryInRedis,
  deleteSubcategoryFromRedis,
  getAllMaterials,
  addMaterialToRedis,
  updateMaterialInRedis,
  deleteMaterialFromRedis,
  getAllFinishes,
  addFinishToRedis,
  updateFinishInRedis,
  deleteFinishFromRedis,
  getAllFinishCategories,
  addFinishCategoryToRedis,
  updateFinishCategoryInRedis,
  deleteFinishCategoryFromRedis,
  getHeroImagesFromRedis,
  setHeroImagesInRedis,
  getCaseStudyById,
  getProductById
} from './redis';

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

const defaultProductsData: Product[] = [
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
    finishes: [
      "PVD Satin Stainless Steel",
      "PVD Satin Black",
      "Satin Stainless Steel",
    ],
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
    finishes: [
      "Brass",
      "PVD Satin Gold",
      "PVD Satin Bronze",
      "PVD Polished Copper",
    ],
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
  {
    id: 1,
    name: "Cabinet Handle",
    categoryId: 2,
    description: "Handles for cabinets",
  },
  {
    id: 2,
    name: "Door Handle",
    categoryId: 2,
    description: "Handles for doors",
  },
];

const defaultMaterials: Material[] = [
  { id: 1, name: "Stainless Steel", description: "Premium stainless steel" },
  { id: 2, name: "Brass", description: "High-quality brass" },
];

const defaultFinishCategories: FinishCategory[] = [
  {
    id: 1,
    name: "Stainless Steel Finish",
    description: "Finishes for stainless steel products",
  },
  { id: 2, name: "Brass Finish", description: "Finishes for brass products" },
  {
    id: 3,
    name: "PVD Finish",
    description: "Physical Vapor Deposition finishes",
  },
];

const defaultFinishes: Finish[] = [
  { id: 1, name: "Matt", categoryId: 1, image: "/images/finishes/matt.jpg" },
  {
    id: 2,
    name: "Glossy Chrome",
    categoryId: 1,
    image: "/images/finishes/glossy-chrome.jpg",
  },
  {
    id: 3,
    name: "Satin",
    categoryId: 1,
    image: "/images/finishes/satin-stainless-steel.jpg",
  },
  {
    id: 4,
    name: "Black Satin",
    categoryId: 1,
    image: "/images/finishes/satin-black.jpg",
  },
  {
    id: 5,
    name: "Brass Antique",
    categoryId: 2,
    image: "/images/finishes/brass.jpg",
  },
  {
    id: 6,
    name: "Rose Gold",
    categoryId: 3,
    image: "/images/finishes/pvd-rose-gold.jpg",
  },
  {
    id: 7,
    name: "Matte Black",
    categoryId: 3,
    image: "/images/finishes/pvd-satin-black.jpg",
  },
  {
    id: 8,
    name: "PVD Rose Gold",
    categoryId: 3,
    image: "/images/finishes/pvd-polished-copper.jpg",
  },
  {
    id: 9,
    name: "PVD Gold",
    categoryId: 3,
    image: "/images/finishes/pvd-satin-gold.jpg",
  },
  {
    id: 10,
    name: "PVD Bronze",
    categoryId: 3,
    image: "/images/finishes/pvd-satin-bronze.jpg",
  },
  {
    id: 11,
    name: "PVD Nickel",
    categoryId: 3,
    image: "/images/finishes/pvd-satin-nickel.jpg",
  },
];

// ============================================
// DATA ACCESS LAYER (Redis-backed)
// ============================================

// Product management functions
export const getProducts = async (): Promise<Product[]> => {
  return await getAllProducts();
};

export const addProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  return await addProductToRedis(product);
};

export const updateProduct = async (
  id: number,
  updates: Partial<Product>
): Promise<Product | null> => {
  return await updateProductInRedis(id, updates);
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  return await deleteProductFromRedis(id);
};

// Blog management functions
export const getBlogs = async (): Promise<Blog[]> => {
  return await getAllBlogs();
};

export const addBlog = async (blog: Omit<Blog, "id">): Promise<Blog> => {
  return await addBlogToRedis(blog);
};

export const updateBlog = async (id: number, updates: Partial<Blog>): Promise<Blog | null> => {
  return await updateBlogInRedis(id, updates);
};

export const deleteBlog = async (id: number): Promise<boolean> => {
  return await deleteBlogFromRedis(id);
};

// Testimonial management functions
export const getTestimonials = async (): Promise<Testimonial[]> => {
  return await getAllTestimonials();
};

export const addTestimonial = async (
  testimonial: Omit<Testimonial, "id">
): Promise<Testimonial> => {
  return await addTestimonialToRedis(testimonial);
};

export const updateTestimonial = async (
  id: number,
  updates: Partial<Testimonial>
): Promise<Testimonial | null> => {
  return await updateTestimonialInRedis(id, updates);
};

export const deleteTestimonial = async (id: number): Promise<boolean> => {
  return await deleteTestimonialFromRedis(id);
};

// Case Study management functions
export const getCaseStudies = async (): Promise<CaseStudy[]> => {
  return await getAllCaseStudies();
};

export const addCaseStudy = async (caseStudy: Omit<CaseStudy, "id">): Promise<CaseStudy> => {
  return await addCaseStudyToRedis(caseStudy);
};

export const updateCaseStudy = async (
  id: number,
  updates: Partial<CaseStudy>
): Promise<CaseStudy | null> => {
  return await updateCaseStudyInRedis(id, updates);
};

export const deleteCaseStudy = async (id: number): Promise<boolean> => {
  return await deleteCaseStudyFromRedis(id);
};

// Hero Images management
export const getHeroImages = async (): Promise<string[]> => {
  return await getHeroImagesFromRedis();
};

export const setHeroImages = async (images: string[]): Promise<void> => {
  return await setHeroImagesInRedis(images);
};

// ========================================
// Taxonomy Management Functions
// ========================================

// Category management
export const getCategories = async (): Promise<Category[]> => {
  return await getAllCategories();
};

export const addCategory = async (category: Omit<Category, "id">): Promise<Category> => {
  return await addCategoryToRedis(category);
};

export const updateCategory = async (
  id: number,
  updates: Partial<Category>
): Promise<Category | null> => {
  return await updateCategoryInRedis(id, updates);
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  // Check if category has products
  const products = await getAllProducts();
  const categories = await getAllCategories();
  const categoryName = categories.find((c) => c.id === id)?.name;

  const hasProducts = products.some(
    (p) => p.categoryId === id || (categoryName && p.category === categoryName)
  );

  if (hasProducts) {
    return false; // Cannot delete category with products
  }

  // Delete associated subcategories and materials
  const subcategories = await getAllSubcategories();
  const materials = await getAllMaterials();
  
  await Promise.all(
    subcategories
      .filter((s) => s.categoryId === id)
      .map((s) => deleteSubcategoryFromRedis(s.id))
  );
  
  await Promise.all(
    materials
      .filter((m) => m.categoryId === id)
      .map((m) => deleteMaterialFromRedis(m.id))
  );

  return await deleteCategoryFromRedis(id);
};

// Subcategory management
export const getSubcategories = async (): Promise<Subcategory[]> => {
  return await getAllSubcategories();
};

export const addSubcategory = async (
  subcategory: Omit<Subcategory, "id">
): Promise<Subcategory> => {
  return await addSubcategoryToRedis(subcategory);
};

export const updateSubcategory = async (
  id: number,
  updates: Partial<Subcategory>
): Promise<Subcategory | null> => {
  return await updateSubcategoryInRedis(id, updates);
};

export const deleteSubcategory = async (id: number): Promise<boolean> => {
  // Check if subcategory has products
  const products = await getAllProducts();
  const subcategories = await getAllSubcategories();
  const subcategoryName = subcategories.find((s) => s.id === id)?.name;

  const hasProducts = products.some(
    (p) =>
      p.subcategoryId === id ||
      (subcategoryName && p.subcategory === subcategoryName)
  );

  if (hasProducts) {
    return false; // Cannot delete subcategory with products
  }

  // Delete associated materials
  const materials = await getAllMaterials();
  await Promise.all(
    materials
      .filter((m) => m.subcategoryId === id)
      .map((m) => deleteMaterialFromRedis(m.id))
  );

  return await deleteSubcategoryFromRedis(id);
};

// Material management
export const getMaterials = async (): Promise<Material[]> => {
  return await getAllMaterials();
};

export const addMaterial = async (material: Omit<Material, "id">): Promise<Material> => {
  return await addMaterialToRedis(material);
};

export const updateMaterial = async (
  id: number,
  updates: Partial<Material>
): Promise<Material | null> => {
  return await updateMaterialInRedis(id, updates);
};

export const deleteMaterial = async (id: number): Promise<boolean> => {
  // Check if material has products
  const products = await getAllProducts();
  const materials = await getAllMaterials();
  const materialName = materials.find((m) => m.id === id)?.name;

  const hasMaterial = products.some(
    (p) =>
      p.materialId === id ||
      (materialName && p.material === materialName)
  );

  if (hasMaterial) {
    return false; // Cannot delete material with products
  }

  return await deleteMaterialFromRedis(id);
};

// Finish management
export const getFinishes = async (): Promise<Finish[]> => {
  return await getAllFinishes();
};

export const addFinish = async (finish: Omit<Finish, "id">): Promise<Finish> => {
  return await addFinishToRedis(finish);
};

export const updateFinish = async (
  id: number,
  updates: Partial<Finish>
): Promise<Finish | null> => {
  return await updateFinishInRedis(id, updates);
};

export const deleteFinish = async (id: number): Promise<boolean> => {
  return await deleteFinishFromRedis(id);
};

// Finish Category management
export const getFinishCategories = async (): Promise<FinishCategory[]> => {
  return await getAllFinishCategories();
};

export const addFinishCategory = async (
  category: Omit<FinishCategory, "id">
): Promise<FinishCategory> => {
  return await addFinishCategoryToRedis(category);
};

export const updateFinishCategory = async (
  id: number,
  updates: Partial<FinishCategory>
): Promise<FinishCategory | null> => {
  return await updateFinishCategoryInRedis(id, updates);
};

export const deleteFinishCategory = async (id: number): Promise<boolean> => {
  // Check if category has finishes
  const finishes = await getAllFinishes();
  const hasFinishes = finishes.some((f) => f.categoryId === id);
  if (hasFinishes) {
    return false; // Cannot delete category with finishes
  }

  return await deleteFinishCategoryFromRedis(id);
};
