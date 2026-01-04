// Upstash Redis client and operations
import { Redis } from "@upstash/redis";
import type { Product, CaseStudy } from "./data";
import { ENV } from "./env";

// Initialize Upstash Redis client
const redis = new Redis({
  url: ENV.UPSTASH_REDIS_REST_URL,
  token: ENV.UPSTASH_REDIS_REST_TOKEN,
});

// Redis key patterns
const PRODUCTS_KEY = "hindonix:products:ids"; // Set of all product IDs
const PRODUCT_KEY_PREFIX = "hindonix:products"; // Hash keys: products:{id}
const CASE_STUDIES_KEY = "hindonix:case_studies:ids"; // Set of all case study IDs
const CASE_STUDY_KEY_PREFIX = "hindonix:case_studies"; // Hash keys: case_studies:{id}

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
    if (typeof (product as any).finishes === 'string') {
      (product as any).finishes = JSON.parse((product as any).finishes as string);
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
    const products = await Promise.all(
      ids.map((id) => getProductById(id))
    );

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
  product: Omit<Product, "id">
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
  updates: Partial<Product>
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
export const getCaseStudyById = async (id: number): Promise<CaseStudy | null> => {
  try {
    const caseStudy = await redis.hgetall(`${CASE_STUDY_KEY_PREFIX}:${id}`);
    if (!caseStudy || Object.keys(caseStudy).length === 0) return null;
    
    // Ensure stats is an array (Redis may store it as string)
    if (typeof (caseStudy as any).stats === 'string') {
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
      ids.map((id) => getCaseStudyById(id))
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
  caseStudy: Omit<CaseStudy, "id">
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
  updates: Partial<CaseStudy>
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
export const deleteCaseStudyFromRedis = async (id: number): Promise<boolean> => {
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
        await redis.hset(`${CASE_STUDY_KEY_PREFIX}:${caseStudy.id}`, caseStudyData);
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
