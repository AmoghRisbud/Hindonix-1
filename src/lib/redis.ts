// Upstash Redis client and operations
import { Redis } from "@upstash/redis";
import type {
  Product,
  CaseStudy,
  Blog,
  Testimonial,
  Category,
  Subcategory,
  Material,
  Finish,
  FinishCategory,
} from "./data";
import { ENV } from "./env";

// Initialize Upstash Redis client
const redis = new Redis({
  url: ENV.UPSTASH_REDIS_REST_URL,
  token: ENV.UPSTASH_REDIS_REST_TOKEN,
});

// Redis key patterns
const PRODUCTS_KEY = "hindonix:products:ids";
const PRODUCT_KEY_PREFIX = "hindonix:products";
const CASE_STUDIES_KEY = "hindonix:case_studies:ids";
const CASE_STUDY_KEY_PREFIX = "hindonix:case_studies";
const BLOGS_KEY = "hindonix:blogs:ids";
const BLOG_KEY_PREFIX = "hindonix:blogs";
const TESTIMONIALS_KEY = "hindonix:testimonials:ids";
const TESTIMONIAL_KEY_PREFIX = "hindonix:testimonials";
const CATEGORIES_KEY = "hindonix:categories:ids";
const CATEGORY_KEY_PREFIX = "hindonix:categories";
const SUBCATEGORIES_KEY = "hindonix:subcategories:ids";
const SUBCATEGORY_KEY_PREFIX = "hindonix:subcategories";
const MATERIALS_KEY = "hindonix:materials:ids";
const MATERIAL_KEY_PREFIX = "hindonix:materials";
const FINISHES_KEY = "hindonix:finishes:ids";
const FINISH_KEY_PREFIX = "hindonix:finishes";
const FINISH_CATEGORIES_KEY = "hindonix:finish_categories:ids";
const FINISH_CATEGORY_KEY_PREFIX = "hindonix:finish_categories";
const HERO_IMAGE_KEY = "hindonix:hero_image";
const HERO_IMAGES_KEY = "hindonix:hero_images";

// Helper for generic CRUD operations
async function getEntityIds(key: string): Promise<number[]> {
  try {
    const ids = await redis.smembers(key);
    return (ids || []) as unknown as number[];
  } catch (error) {
    console.error(`Error fetching IDs from ${key}:`, error);
    return [];
  }
}

async function getEntityById<T>(prefix: string, id: number): Promise<T | null> {
  try {
    const entity = await redis.hgetall(`${prefix}:${id}`);
    if (!entity || Object.keys(entity).length === 0) return null;
    return entity as unknown as T;
  } catch (error) {
    console.error(`Error fetching entity ${prefix}:${id}:`, error);
    return null;
  }
}

async function getAllEntities<T>(
  idsKey: string,
  prefix: string,
  fetcher?: (id: number) => Promise<T | null>,
): Promise<T[]> {
  try {
    const ids = await getEntityIds(idsKey);
    if (ids.length === 0) return [];

    const fetchFn = fetcher || ((id) => getEntityById<T>(prefix, id));

    const entities = await Promise.all(ids.map(fetchFn));
    return entities.filter((e) => e !== null) as T[];
  } catch (error) {
    console.error(`Error fetching all entities from ${idsKey}:`, error);
    return [];
  }
}

async function addEntity<T extends { id: number }>(
  idsKey: string,
  prefix: string,
  entity: Omit<T, "id">,
  transform?: (e: T) => any,
): Promise<T> {
  const id = Date.now();
  const newEntity = { ...entity, id } as T;

  try {
    const data = transform ? transform(newEntity) : newEntity;
    await redis.hset(`${prefix}:${id}`, data);
    await redis.sadd(idsKey, id);
    return newEntity;
  } catch (error) {
    console.error(`Error adding entity to ${prefix}:`, error);
    throw new Error("Failed to add entity to Redis");
  }
}

async function updateEntity<T extends { id: number }>(
  prefix: string,
  id: number,
  updates: Partial<T>,
  fetcher: (id: number) => Promise<T | null>,
  transform?: (e: T) => any,
): Promise<T | null> {
  try {
    const existing = await fetcher(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    const data = transform ? transform(updated) : updated;

    await redis.hset(`${prefix}:${id}`, data);
    return updated;
  } catch (error) {
    console.error(`Error updating entity ${prefix}:${id}:`, error);
    throw new Error("Failed to update entity in Redis");
  }
}

async function deleteEntity(
  idsKey: string,
  prefix: string,
  id: number,
): Promise<boolean> {
  try {
    await redis.del(`${prefix}:${id}`);
    await redis.srem(idsKey, id);
    return true;
  } catch (error) {
    console.error(`Error deleting entity ${prefix}:${id}:`, error);
    return false;
  }
}

// ============================================
// PRODUCT OPERATIONS
// ============================================

/**
 * Get all product IDs from the set
 */
export const getAllProductIds = async (): Promise<number[]> => {
  try {
    const ids = await redis.smembers(PRODUCTS_KEY);
    return (ids || []) as unknown as number[];
  } catch (error) {
    console.error("Error fetching product IDs:", error);
    return [];
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const product = await redis.hgetall(`${PRODUCT_KEY_PREFIX}:${id}`);
    if (!product || Object.keys(product).length === 0) return null;

    // Ensure finishes is an array (Redis may store it as string)
    if (typeof (product as any).finishes === "string") {
      (product as any).finishes = JSON.parse(
        (product as any).finishes as string,
      );
    }

    return product as unknown as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

/**
 * Get all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const ids = await getAllProductIds();
    if (ids.length === 0) return [];

    // Fetch all products in parallel
    const products = await Promise.all(ids.map((id) => getProductById(id)));

    // Filter out null values and return
    return products.filter((p): p is Product => p !== null);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

/**
 * Add a new product to Redis
 */
export const addProductToRedis = async (
  product: Omit<Product, "id">,
): Promise<Product> => {
  const id = Date.now();
  const newProduct: Product = { ...product, id };

  try {
    // Prepare product data for Redis hash (convert array to JSON string)
    const productData = {
      ...newProduct,
      finishes: JSON.stringify(newProduct.finishes),
    };

    // Store product as hash
    await redis.hset(`${PRODUCT_KEY_PREFIX}:${id}`, productData);

    // Add ID to the set of product IDs
    await redis.sadd(PRODUCTS_KEY, id);

    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product to Redis");
  }
};

/**
 * Update an existing product
 */
export const updateProductInRedis = async (
  id: number,
  updates: Partial<Product>,
): Promise<Product | null> => {
  try {
    const existingProduct = await getProductById(id);
    if (!existingProduct) return null;

    const updatedProduct = { ...existingProduct, ...updates };

    // Prepare updates for Redis hash
    const productData = {
      ...updatedProduct,
      finishes: JSON.stringify(updatedProduct.finishes),
    };

    await redis.hset(`${PRODUCT_KEY_PREFIX}:${id}`, productData);

    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw new Error("Failed to update product in Redis");
  }
};

/**
 * Delete a product from Redis
 */
export const deleteProductFromRedis = async (id: number): Promise<boolean> => {
  try {
    // Remove product hash
    await redis.del(`${PRODUCT_KEY_PREFIX}:${id}`);

    // Remove ID from the set
    await redis.srem(PRODUCTS_KEY, id);

    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return false;
  }
};

// ============================================
// CASE STUDY OPERATIONS
// ============================================

/**
 * Get all case study IDs from the set
 */
export const getAllCaseStudyIds = async (): Promise<number[]> => {
  try {
    const ids = await redis.smembers(CASE_STUDIES_KEY);
    return (ids || []) as unknown as number[];
  } catch (error) {
    console.error("Error fetching case study IDs:", error);
    return [];
  }
};

/**
 * Get a single case study by ID
 */
export const getCaseStudyById = async (
  id: number,
): Promise<CaseStudy | null> => {
  try {
    const caseStudy = await redis.hgetall(`${CASE_STUDY_KEY_PREFIX}:${id}`);
    if (!caseStudy || Object.keys(caseStudy).length === 0) return null;

    // Ensure stats is an array (Redis may store it as string)
    if (typeof (caseStudy as any).stats === "string") {
      (caseStudy as any).stats = JSON.parse((caseStudy as any).stats as string);
    }

    return caseStudy as unknown as CaseStudy;
  } catch (error) {
    console.error(`Error fetching case study ${id}:`, error);
    return null;
  }
};

/**
 * Get all case studies
 */
export const getAllCaseStudies = async (): Promise<CaseStudy[]> => {
  try {
    const ids = await getAllCaseStudyIds();
    if (ids.length === 0) return [];

    // Fetch all case studies in parallel
    const caseStudies = await Promise.all(
      ids.map((id) => getCaseStudyById(id)),
    );

    // Filter out null values and return
    return caseStudies.filter((cs): cs is CaseStudy => cs !== null);
  } catch (error) {
    console.error("Error fetching all case studies:", error);
    return [];
  }
};

/**
 * Add a new case study to Redis
 */
export const addCaseStudyToRedis = async (
  caseStudy: Omit<CaseStudy, "id">,
): Promise<CaseStudy> => {
  const id = Date.now();
  const newCaseStudy: CaseStudy = { ...caseStudy, id };

  try {
    // Prepare case study data for Redis hash (convert array to JSON string)
    const caseStudyData = {
      ...newCaseStudy,
      stats: JSON.stringify(newCaseStudy.stats),
    };

    // Store case study as hash
    await redis.hset(`${CASE_STUDY_KEY_PREFIX}:${id}`, caseStudyData);

    // Add ID to the set of case study IDs
    await redis.sadd(CASE_STUDIES_KEY, id);

    return newCaseStudy;
  } catch (error) {
    console.error("Error adding case study:", error);
    throw new Error("Failed to add case study to Redis");
  }
};

/**
 * Update an existing case study
 */
export const updateCaseStudyInRedis = async (
  id: number,
  updates: Partial<CaseStudy>,
): Promise<CaseStudy | null> => {
  try {
    const existingCaseStudy = await getCaseStudyById(id);
    if (!existingCaseStudy) return null;

    const updatedCaseStudy = { ...existingCaseStudy, ...updates };

    // Prepare updates for Redis hash
    const caseStudyData = {
      ...updatedCaseStudy,
      stats: JSON.stringify(updatedCaseStudy.stats),
    };

    await redis.hset(`${CASE_STUDY_KEY_PREFIX}:${id}`, caseStudyData);

    return updatedCaseStudy;
  } catch (error) {
    console.error(`Error updating case study ${id}:`, error);
    throw new Error("Failed to update case study in Redis");
  }
};

/**
 * Delete a case study from Redis
 */
export const deleteCaseStudyFromRedis = async (
  id: number,
): Promise<boolean> => {
  try {
    // Remove case study hash
    await redis.del(`${CASE_STUDY_KEY_PREFIX}:${id}`);

    // Remove ID from the set
    await redis.srem(CASE_STUDIES_KEY, id);

    return true;
  } catch (error) {
    console.error(`Error deleting case study ${id}:`, error);
    return false;
  }
};

// ============================================
// BLOG OPERATIONS
// ============================================

export const getAllBlogs = async (): Promise<Blog[]> => {
  return getAllEntities(BLOGS_KEY, BLOG_KEY_PREFIX);
};

export const addBlogToRedis = async (blog: Omit<Blog, "id">): Promise<Blog> => {
  return addEntity(BLOGS_KEY, BLOG_KEY_PREFIX, blog);
};

export const updateBlogInRedis = async (
  id: number,
  updates: Partial<Blog>,
): Promise<Blog | null> => {
  return updateEntity(BLOG_KEY_PREFIX, id, updates, (id) =>
    getEntityById<Blog>(BLOG_KEY_PREFIX, id),
  );
};

export const deleteBlogFromRedis = async (id: number): Promise<boolean> => {
  return deleteEntity(BLOGS_KEY, BLOG_KEY_PREFIX, id);
};

// ============================================
// TESTIMONIAL OPERATIONS
// ============================================

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  return getAllEntities(TESTIMONIALS_KEY, TESTIMONIAL_KEY_PREFIX);
};

export const addTestimonialToRedis = async (
  testimonial: Omit<Testimonial, "id">,
): Promise<Testimonial> => {
  return addEntity(TESTIMONIALS_KEY, TESTIMONIAL_KEY_PREFIX, testimonial);
};

export const updateTestimonialInRedis = async (
  id: number,
  updates: Partial<Testimonial>,
): Promise<Testimonial | null> => {
  return updateEntity(TESTIMONIAL_KEY_PREFIX, id, updates, (id) =>
    getEntityById<Testimonial>(TESTIMONIAL_KEY_PREFIX, id),
  );
};

export const deleteTestimonialFromRedis = async (
  id: number,
): Promise<boolean> => {
  return deleteEntity(TESTIMONIALS_KEY, TESTIMONIAL_KEY_PREFIX, id);
};

// ============================================
// TAXONOMY OPERATIONS
// ============================================

// Categories
export const getAllCategories = async (): Promise<Category[]> => {
  return getAllEntities(CATEGORIES_KEY, CATEGORY_KEY_PREFIX);
};

export const addCategoryToRedis = async (
  category: Omit<Category, "id">,
): Promise<Category> => {
  return addEntity(CATEGORIES_KEY, CATEGORY_KEY_PREFIX, category);
};

export const updateCategoryInRedis = async (
  id: number,
  updates: Partial<Category>,
): Promise<Category | null> => {
  return updateEntity(CATEGORY_KEY_PREFIX, id, updates, (id) =>
    getEntityById<Category>(CATEGORY_KEY_PREFIX, id),
  );
};

export const deleteCategoryFromRedis = async (id: number): Promise<boolean> => {
  return deleteEntity(CATEGORIES_KEY, CATEGORY_KEY_PREFIX, id);
};

// Subcategories
export const getAllSubcategories = async (): Promise<Subcategory[]> => {
  return getAllEntities(SUBCATEGORIES_KEY, SUBCATEGORY_KEY_PREFIX);
};

export const addSubcategoryToRedis = async (
  subcategory: Omit<Subcategory, "id">,
): Promise<Subcategory> => {
  return addEntity(SUBCATEGORIES_KEY, SUBCATEGORY_KEY_PREFIX, subcategory);
};

export const updateSubcategoryInRedis = async (
  id: number,
  updates: Partial<Subcategory>,
): Promise<Subcategory | null> => {
  return updateEntity(SUBCATEGORY_KEY_PREFIX, id, updates, (id) =>
    getEntityById<Subcategory>(SUBCATEGORY_KEY_PREFIX, id),
  );
};

export const deleteSubcategoryFromRedis = async (
  id: number,
): Promise<boolean> => {
  return deleteEntity(SUBCATEGORIES_KEY, SUBCATEGORY_KEY_PREFIX, id);
};

// Materials
export const getAllMaterials = async (): Promise<Material[]> => {
  return getAllEntities(MATERIALS_KEY, MATERIAL_KEY_PREFIX);
};

export const addMaterialToRedis = async (
  material: Omit<Material, "id">,
): Promise<Material> => {
  return addEntity(MATERIALS_KEY, MATERIAL_KEY_PREFIX, material);
};

export const updateMaterialInRedis = async (
  id: number,
  updates: Partial<Material>,
): Promise<Material | null> => {
  return updateEntity(MATERIAL_KEY_PREFIX, id, updates, (id) =>
    getEntityById<Material>(MATERIAL_KEY_PREFIX, id),
  );
};

export const deleteMaterialFromRedis = async (id: number): Promise<boolean> => {
  return deleteEntity(MATERIALS_KEY, MATERIAL_KEY_PREFIX, id);
};

// Finishes
export const getAllFinishes = async (): Promise<Finish[]> => {
  return getAllEntities(FINISHES_KEY, FINISH_KEY_PREFIX);
};

export const addFinishToRedis = async (
  finish: Omit<Finish, "id">,
): Promise<Finish> => {
  return addEntity(FINISHES_KEY, FINISH_KEY_PREFIX, finish);
};

export const updateFinishInRedis = async (
  id: number,
  updates: Partial<Finish>,
): Promise<Finish | null> => {
  return updateEntity(FINISH_KEY_PREFIX, id, updates, (id) =>
    getEntityById<Finish>(FINISH_KEY_PREFIX, id),
  );
};

export const deleteFinishFromRedis = async (id: number): Promise<boolean> => {
  return deleteEntity(FINISHES_KEY, FINISH_KEY_PREFIX, id);
};

// Finish Categories
export const getAllFinishCategories = async (): Promise<FinishCategory[]> => {
  return getAllEntities(FINISH_CATEGORIES_KEY, FINISH_CATEGORY_KEY_PREFIX);
};

export const addFinishCategoryToRedis = async (
  finishCategory: Omit<FinishCategory, "id">,
): Promise<FinishCategory> => {
  return addEntity(
    FINISH_CATEGORIES_KEY,
    FINISH_CATEGORY_KEY_PREFIX,
    finishCategory,
  );
};

export const updateFinishCategoryInRedis = async (
  id: number,
  updates: Partial<FinishCategory>,
): Promise<FinishCategory | null> => {
  return updateEntity(FINISH_CATEGORY_KEY_PREFIX, id, updates, (id) =>
    getEntityById<FinishCategory>(FINISH_CATEGORY_KEY_PREFIX, id),
  );
};

export const deleteFinishCategoryFromRedis = async (
  id: number,
): Promise<boolean> => {
  return deleteEntity(FINISH_CATEGORIES_KEY, FINISH_CATEGORY_KEY_PREFIX, id);
};

// ============================================
// HERO IMAGE OPERATIONS
// ============================================

export const getHeroImagesFromRedis = async (): Promise<string[]> => {
  try {
    const imagesData = await redis.get(HERO_IMAGES_KEY);
    console.log("🟢 Redis: Raw data from Redis:", imagesData);
    console.log("🟢 Redis: Data type:", typeof imagesData);
    console.log("🟢 Redis: Is array?:", Array.isArray(imagesData));

    if (imagesData) {
      // Check if it's already an array (Upstash auto-parses JSON)
      if (Array.isArray(imagesData)) {
        console.log("🟢 Redis: Data is already an array:", imagesData);
        console.log("🟢 Redis: Array length:", imagesData.length);
        if (imagesData.length > 0) {
          return imagesData as string[];
        }
      }
      // If it's a string, try to parse it
      else if (typeof imagesData === "string") {
        try {
          const arr = JSON.parse(imagesData) as string[];
          console.log("🟢 Redis: Parsed array from string:", arr);
          console.log("🟢 Redis: Array length:", arr?.length);
          if (Array.isArray(arr) && arr.length > 0) {
            return arr;
          }
        } catch (e) {
          console.error("🟢 Redis: Parse error:", e);
        }
      }
    }
    // Fallback to single image key for backward compatibility
    console.log("🟢 Redis: Trying fallback to single image key");
    const single = await redis.get(HERO_IMAGE_KEY);
    const url = (single as string) || "/images/home/hero-knobs.jpg";
    console.log("🟢 Redis: Fallback returned:", url);
    return [url];
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return ["/images/home/hero-knobs.jpg"];
  }
};

export const setHeroImagesInRedis = async (urls: string[]): Promise<void> => {
  try {
    console.log("🔵 Redis: Saving hero images:", urls);
    console.log("🔵 Redis: Array length:", urls.length);
    const jsonString = JSON.stringify(urls);
    console.log("🔵 Redis: JSON string:", jsonString);
    await redis.set(HERO_IMAGES_KEY, jsonString);
    console.log("🔵 Redis: Save successful");
  } catch (error) {
    console.error("Error setting hero images:", error);
    throw new Error("Failed to set hero images");
  }
};

// ============================================
// MIGRATION & INITIALIZATION
// ============================================

/**
 * Check if Redis has been initialized with data
 */
export const isRedisInitialized = async (): Promise<boolean> => {
  try {
    const productIds = await getAllProductIds();
    return productIds.length > 0;
  } catch (error) {
    console.error("Error checking Redis initialization:", error);
    return false;
  }
};

/**
 * Migrate data from localStorage to Redis (one-time operation)
 */
export const migrateLocalStorageToRedis = async (): Promise<{
  products: number;
  caseStudies: number;
}> => {
  let productsCount = 0;
  let caseStudiesCount = 0;

  try {
    // Migrate products
    const productsData = localStorage.getItem("hindonix_products");
    if (productsData) {
      const products: Product[] = JSON.parse(productsData);
      for (const product of products) {
        const productData = {
          ...product,
          finishes: JSON.stringify(product.finishes),
        };
        await redis.hset(`${PRODUCT_KEY_PREFIX}:${product.id}`, productData);
        await redis.sadd(PRODUCTS_KEY, product.id);
        productsCount++;
      }
    }

    // Migrate case studies
    const caseStudiesData = localStorage.getItem("hindonix_case_studies");
    if (caseStudiesData) {
      const caseStudies: CaseStudy[] = JSON.parse(caseStudiesData);
      for (const caseStudy of caseStudies) {
        const caseStudyData = {
          ...caseStudy,
          stats: JSON.stringify(caseStudy.stats),
        };
        await redis.hset(
          `${CASE_STUDY_KEY_PREFIX}:${caseStudy.id}`,
          caseStudyData,
        );
        await redis.sadd(CASE_STUDIES_KEY, caseStudy.id);
        caseStudiesCount++;
      }
    }

    return { products: productsCount, caseStudies: caseStudiesCount };
  } catch (error) {
    console.error("Error migrating data to Redis:", error);
    throw new Error("Failed to migrate data to Redis");
  }
};
