// Shared data store for products and case studies
// Now uses Redis for persistence via redis.ts module
import {
  getAllProducts,
  addProductToRedis,
  updateProductInRedis,
  deleteProductFromRedis,
  getAllCaseStudies,
  addCaseStudyToRedis,
  updateCaseStudyInRedis,
  deleteCaseStudyFromRedis,
} from "./redis";

export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  image: string;
  finishes: string[];
}

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

const defaultCaseStudiesData: CaseStudy[] = [
  {
    id: 1,
    title: "Scaling Hardware Exports to the Middle East",
    client: "European Tool Manufacturer",
    category: "Export",
    location: "Germany → UAE, Saudi Arabia",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
    problem:
      "A German tool manufacturer struggled to penetrate Middle Eastern markets due to complex regulations and lack of local distribution networks.",
    solution:
      "We established strategic partnerships with regional distributors, streamlined documentation processes, and set up efficient logistics routes.",
    outcome:
      "300% increase in Middle East sales within 18 months, with distribution now covering 8 countries.",
    stats: [
      { label: "Sales Increase", value: "300%" },
      { label: "Countries Covered", value: "8" },
      { label: "Time to Market", value: "-40%" },
    ],
  },
  {
    id: 2,
    title: "Optimizing Import Costs for Construction Supplies",
    client: "Santos Construction Group",
    category: "Import",
    location: "China → Brazil",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    problem:
      "High import duties and lengthy customs clearance were significantly impacting profit margins and project timelines.",
    solution:
      "Implemented duty optimization strategies, streamlined customs procedures, and established bonded warehouse solutions.",
    outcome:
      "Reduced import costs by 25% and cut average clearance time from 15 days to 5 days.",
    stats: [
      { label: "Cost Reduction", value: "25%" },
      { label: "Clearance Time", value: "5 days" },
      { label: "Annual Savings", value: "$2M" },
    ],
  },
  {
    id: 3,
    title: "Multi-Country Logistics Consolidation",
    client: "Pacific Tools Ltd",
    category: "Logistics",
    location: "Asia → Australia",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&h=400&fit=crop",
    problem:
      "Managing shipments from multiple Asian suppliers resulted in high freight costs and inventory management challenges.",
    solution:
      "Established a consolidation hub in Singapore, implemented inventory management systems, and optimized shipping routes.",
    outcome:
      "Reduced logistics costs by 35% and improved inventory turnover by 50%.",
    stats: [
      { label: "Freight Savings", value: "35%" },
      { label: "Inventory Turnover", value: "+50%" },
      { label: "Suppliers Managed", value: "25+" },
    ],
  },
];

// Export default data for initialization purposes
export const defaultProducts = defaultProductsData;
export const defaultCaseStudies = defaultCaseStudiesData;

// Product management functions - now async with Redis
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

// Case Study management functions - now async with Redis
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
