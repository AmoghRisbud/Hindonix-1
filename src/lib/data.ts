// Shared data store for products and case studies
export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  image: string;
  finishes: string[];
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
    category: "Knobs",
    subcategory: "Brass Knob",
    description:
      "Timeless brass knob with exceptional craftsmanship and warm golden finish.",
    image: "/images/products/knobs/brassknob1.jpg",
    finishes: ["Brass", "PVD Satin Gold", "PVD Polished Copper"],
  },
  {
    id: 2,
    name: "Wooden Cabinet Knob",
    category: "Knobs",
    subcategory: "Wooden Knobs",
    description:
      "Handcrafted wooden knobs combining natural beauty with modern design.",
    image: "/images/products/knobs/wooden-knob-1.jpg",
    finishes: ["Natural Wood"],
  },
  {
    id: 3,
    name: "Cotton Rope Knob",
    category: "Knobs",
    subcategory: "Cotton Knobs",
    description:
      "Unique textile-wrapped knobs adding a soft, contemporary touch.",
    image: "/images/products/knobs/cotton-knob-1.jpg",
    finishes: ["Natural Cotton"],
  },
  {
    id: 4,
    name: "Stainless Steel Knob",
    category: "Knobs",
    subcategory: "Metal Knobs",
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
    id: 5,
    name: "Architectural Door Handle",
    category: "Door Handles",
    description:
      "Precision-engineered door handle with ergonomic design and multiple finish options.",
    image: "/images/products/door-handles/door-handle-1.jpg",
    finishes: ["PVD Satin Black", "PVD Satin Bronze", "Satin Black"],
  },
  {
    id: 6,
    name: "Contemporary Lever Handle",
    category: "Door Handles",
    description:
      "Sleek lever handle combining functionality with minimalist aesthetics.",
    image: "/images/products/door-handles/door-handle-2.jpg",
    finishes: ["Polished Stainless Steel", "PVD Satin Nickel", "Brass"],
  },
  {
    id: 7,
    name: "Premium Pull Handle",
    category: "Pull Handles",
    description:
      "Robust pull handle perfect for entrance doors and commercial applications.",
    image: "/images/products/pull-handles/pull-handle-1.jpg",
    finishes: ["PVD Satin Stainless Steel", "PVD Satin Black", "Brass"],
  },
  {
    id: 8,
    name: "Designer Pull Handle",
    category: "Pull Handles",
    description:
      "Statement pull handle with architectural presence and luxurious finishes.",
    image: "/images/products/pull-handles/pull-handle-2.jpg",
    finishes: ["PVD Satin Gold", "PVD Satin Bronze", "PVD Polished Copper"],
  },
  {
    id: 9,
    name: "Minimalist Pull Bar",
    category: "Pull Handles",
    description:
      "Clean-lined pull bar for modern spaces, available in premium finishes.",
    image: "/images/products/pull-handles/pull-handle-3.jpg",
    finishes: ["Satin Stainless Steel", "Satin Black", "Satin Nickel"],
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

let products: Product[] = loadProducts();
let blogs: Blog[] = loadBlogs();
let testimonials: Testimonial[] = loadTestimonials();
let caseStudies: CaseStudy[] = loadCaseStudies();

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

export const updateBlog = (
  id: number,
  updates: Partial<Blog>
): Blog | null => {
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
