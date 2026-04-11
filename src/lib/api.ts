// API client — replaces the old Redis data layer.
// All calls go to /api/* which nginx proxies to the Express back-end.

import type {
  Product,
  Blog,
  Testimonial,
  CaseStudy,
  Category,
  Subcategory,
  Material,
  Finish,
  FinishCategory,
} from "./data";

function getApiBase(): string {
  // In dev the Vite proxy forwards /api → Express.
  // In production nginx handles the proxy.
  return "/api";
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as Record<string, string>).error || res.statusText);
  }
  return res.json() as Promise<T>;
}

// ─── Products ──────────────────────────────────────────────
export const getAllProducts = (): Promise<Product[]> =>
  apiFetch("/products");

export const getProductById = (id: number): Promise<Product | null> =>
  apiFetch<Product | null>(`/products/${id}`).catch(() => null);

export const addProductToApi = (product: Omit<Product, "id">): Promise<Product> =>
  apiFetch("/products", { method: "POST", body: JSON.stringify(product) });

export const updateProductInApi = (id: number, updates: Partial<Product>): Promise<Product | null> =>
  apiFetch<Product | null>(`/products/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteProductFromApi = (id: number): Promise<boolean> =>
  apiFetch<{ success: boolean }>(`/products/${id}`, { method: "DELETE" }).then((r) => r.success);

// ─── Blogs ─────────────────────────────────────────────────
export const getAllBlogs = (): Promise<Blog[]> =>
  apiFetch("/blogs");

export const addBlogToApi = (blog: Omit<Blog, "id">): Promise<Blog> =>
  apiFetch("/blogs", { method: "POST", body: JSON.stringify(blog) });

export const updateBlogInApi = (id: number, updates: Partial<Blog>): Promise<Blog | null> =>
  apiFetch<Blog | null>(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteBlogFromApi = (id: number): Promise<boolean> =>
  apiFetch<{ success: boolean }>(`/blogs/${id}`, { method: "DELETE" }).then((r) => r.success);

// ─── Testimonials ──────────────────────────────────────────
export const getAllTestimonials = (): Promise<Testimonial[]> =>
  apiFetch("/testimonials");

export const addTestimonialToApi = (testimonial: Omit<Testimonial, "id">): Promise<Testimonial> =>
  apiFetch("/testimonials", { method: "POST", body: JSON.stringify(testimonial) });

export const updateTestimonialInApi = (id: number, updates: Partial<Testimonial>): Promise<Testimonial | null> =>
  apiFetch<Testimonial | null>(`/testimonials/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteTestimonialFromApi = (id: number): Promise<boolean> =>
  apiFetch<{ success: boolean }>(`/testimonials/${id}`, { method: "DELETE" }).then((r) => r.success);

// ─── Case Studies ──────────────────────────────────────────
export const getAllCaseStudies = (): Promise<CaseStudy[]> =>
  apiFetch("/case-studies");

export const getCaseStudyById = (id: number): Promise<CaseStudy | null> =>
  apiFetch<CaseStudy | null>(`/case-studies/${id}`).catch(() => null);

export const addCaseStudyToApi = (cs: Omit<CaseStudy, "id">): Promise<CaseStudy> =>
  apiFetch("/case-studies", { method: "POST", body: JSON.stringify(cs) });

export const updateCaseStudyInApi = (id: number, updates: Partial<CaseStudy>): Promise<CaseStudy | null> =>
  apiFetch<CaseStudy | null>(`/case-studies/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteCaseStudyFromApi = (id: number): Promise<boolean> =>
  apiFetch<{ success: boolean }>(`/case-studies/${id}`, { method: "DELETE" }).then((r) => r.success);

// ─── Categories ────────────────────────────────────────────
export const getAllCategories = (): Promise<Category[]> =>
  apiFetch("/categories");

export const addCategoryToApi = (cat: Omit<Category, "id">): Promise<Category> =>
  apiFetch("/categories", { method: "POST", body: JSON.stringify(cat) });

export const updateCategoryInApi = (id: number, updates: Partial<Category>): Promise<Category | null> =>
  apiFetch<Category | null>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteCategoryFromApi = (id: number): Promise<boolean> =>
  apiFetch<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" }).then((r) => r.success);

// ─── Subcategories ─────────────────────────────────────────
export const getAllSubcategories = (): Promise<Subcategory[]> =>
  apiFetch("/subcategories");

export const addSubcategoryToApi = (sub: Omit<Subcategory, "id">): Promise<Subcategory> =>
  apiFetch("/subcategories", { method: "POST", body: JSON.stringify(sub) });

export const updateSubcategoryInApi = (id: number, updates: Partial<Subcategory>): Promise<Subcategory | null> =>
  apiFetch<Subcategory | null>(`/subcategories/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteSubcategoryFromApi = (id: number): Promise<boolean> =>
  apiFetch<{ success: boolean }>(`/subcategories/${id}`, { method: "DELETE" }).then((r) => r.success);

// ─── Materials ─────────────────────────────────────────────
export const getAllMaterials = (): Promise<Material[]> =>
  apiFetch("/materials");

export const addMaterialToApi = (mat: Omit<Material, "id">): Promise<Material> =>
  apiFetch("/materials", { method: "POST", body: JSON.stringify(mat) });

export const updateMaterialInApi = (id: number, updates: Partial<Material>): Promise<Material | null> =>
  apiFetch<Material | null>(`/materials/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteMaterialFromApi = (id: number): Promise<boolean> =>
  apiFetch<{ success: boolean }>(`/materials/${id}`, { method: "DELETE" }).then((r) => r.success);

// ─── Finishes ──────────────────────────────────────────────
export const getAllFinishes = (): Promise<Finish[]> =>
  apiFetch("/finishes");

export const addFinishToApi = (finish: Omit<Finish, "id">): Promise<Finish> =>
  apiFetch("/finishes", { method: "POST", body: JSON.stringify(finish) });

export const updateFinishInApi = (id: number, updates: Partial<Finish>): Promise<Finish | null> =>
  apiFetch<Finish | null>(`/finishes/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteFinishFromApi = (id: number): Promise<boolean> =>
  apiFetch<{ success: boolean }>(`/finishes/${id}`, { method: "DELETE" }).then((r) => r.success);

// ─── Finish Categories ─────────────────────────────────────
export const getAllFinishCategories = (): Promise<FinishCategory[]> =>
  apiFetch("/finish-categories");

export const addFinishCategoryToApi = (fc: Omit<FinishCategory, "id">): Promise<FinishCategory> =>
  apiFetch("/finish-categories", { method: "POST", body: JSON.stringify(fc) });

export const updateFinishCategoryInApi = (id: number, updates: Partial<FinishCategory>): Promise<FinishCategory | null> =>
  apiFetch<FinishCategory | null>(`/finish-categories/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteFinishCategoryFromApi = (id: number): Promise<boolean> =>
  apiFetch<{ success: boolean }>(`/finish-categories/${id}`, { method: "DELETE" }).then((r) => r.success);

// ─── Hero Images ───────────────────────────────────────────
export const getHeroImagesFromApi = (): Promise<string[]> =>
  apiFetch("/hero-images");

export const setHeroImagesInApi = (urls: string[]): Promise<void> =>
  apiFetch("/hero-images", { method: "PUT", body: JSON.stringify({ urls }) }).then(() => {});

export const addHeroImageToApi = (url: string): Promise<void> =>
  apiFetch("/hero-images", { method: "POST", body: JSON.stringify({ url }) }).then(() => {});

export const clearHeroImagesFromApi = (): Promise<void> =>
  apiFetch("/hero-images", { method: "DELETE" }).then(() => {});

// ─── Image Upload (signed, through server) ─────────────────
export interface UploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export const uploadImageViaServer = async (
  file: File,
  options?: { folder?: string; public_id?: string; overwrite?: boolean },
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  if (options?.folder) formData.append("folder", options.folder);
  if (options?.public_id) formData.append("public_id", options.public_id);
  if (options?.overwrite) formData.append("overwrite", "true");

  const res = await fetch(`${getApiBase()}/upload`, {
    method: "POST",
    body: formData,
    // No Content-Type header — browser sets multipart boundary automatically
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as Record<string, string>).error || "Upload failed");
  }

  return res.json() as Promise<UploadResponse>;
};

export const deleteImageViaServer = async (publicId: string): Promise<void> => {
  await apiFetch(`/upload/${publicId}`, { method: "DELETE" });
};
