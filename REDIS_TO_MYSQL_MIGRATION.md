# Redis → MySQL Migration Reference

This document is the authoritative reference for Copilot and developers on how the
Upstash Redis layer was replaced by a MySQL-backed Express API.

---

## Architecture Before vs. After

| Layer | Before (Redis) | After (MySQL) |
|---|---|---|
| Storage | Upstash Redis (REST) | Hostinger MySQL (`u573639995_prod`) |
| Client code | `src/lib/redis.ts` (direct REST calls from browser) | `src/lib/api.ts` (proxied through Express at `/api/...`) |
| Backend | None (Upstash REST from frontend) | `server/index.ts` (Express on port 3001) |
| Local proxy | — | Vite proxy `/api` → `http://localhost:3001` |
| Credentials in browser | ⚠️ Yes (`VITE_UPSTASH_REDIS_REST_*`) | ✅ No (only server-side `.env`) |

---

## Environment Variables

```env
# .env  (server-side only – never VITE_ prefix these)
MYSQL_HOST=srv2210.hstgr.io
MYSQL_PORT=3306
MYSQL_USER=u573639995_admin
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=u573639995_prod
API_PORT=3001
CORS_ORIGIN=*
```

Remove any `VITE_UPSTASH_REDIS_REST_URL` / `VITE_UPSTASH_REDIS_REST_TOKEN` variables
— they are no longer used.

---

## Database Schema

Full schema lives in `server/migrations/init.sql`.  
If `categories` or `hero_images` are missing, run:

```bash
npx tsx server/migrate.ts
# or for the targeted fix:
# apply server/migrations/002_add_categories_hero_images.sql manually via phpMyAdmin
```

### Tables

| Table | Purpose |
|---|---|
| `categories` | Top-level product categories |
| `subcategories` | Sub-groups within a category |
| `materials` | Material types per product |
| `finish_categories` | Groups of finishes (SS / Brass / PVD) |
| `finishes` | Individual finish options with images |
| `products` | Product catalogue |
| `case_studies` | Project case studies |
| `blogs` | Blog posts |
| `testimonials` | Client testimonials |
| `hero_images` | Single-row JSON array of homepage hero image URLs |

---

## API Endpoints (`server/index.ts`)

All routes follow REST conventions. Full list:

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Server liveness check |
| GET | `/api/health/db` | MySQL connection check |
| GET/POST | `/api/products` | List / create products |
| GET/PUT/DELETE | `/api/products/:id` | Get / update / delete product |
| GET/POST | `/api/case-studies` | List / create case studies |
| GET/PUT/DELETE | `/api/case-studies/:id` | Get / update / delete case study |
| GET/POST | `/api/blogs` | List / create blogs |
| GET/PUT/DELETE | `/api/blogs/:id` | Get / update / delete blog |
| GET/POST | `/api/testimonials` | List / create testimonials |
| GET/PUT/DELETE | `/api/testimonials/:id` | Get / update / delete testimonial |
| GET/POST | `/api/categories` | List / create categories |
| GET/PUT/DELETE | `/api/categories/:id` | Get / update / delete category |
| GET/POST | `/api/subcategories` | List / create subcategories |
| GET/PUT/DELETE | `/api/subcategories/:id` | Get / update / delete subcategory |
| GET/POST | `/api/materials` | List / create materials |
| GET/PUT/DELETE | `/api/materials/:id` | Get / update / delete material |
| GET/POST | `/api/finish-categories` | List / create finish categories |
| GET/PUT/DELETE | `/api/finish-categories/:id` | Get / update / delete finish category |
| GET/POST | `/api/finishes` | List / create finishes |
| GET/PUT/DELETE | `/api/finishes/:id` | Get / update / delete finish |
| GET | `/api/hero-images` | Get hero image URL array |
| PUT | `/api/hero-images` | Replace hero image URL array |

---

## Function Name Rename Map (`src/lib/api.ts`)

The exported function names still carry legacy `...ToRedis` / `...FromRedis` / `...InRedis`
suffixes from the old Redis client. They work correctly but should be renamed for clarity.

> **Copilot instruction:** When refactoring, apply the renames below across all
> files that import from `src/lib/api.ts`.

### Products
| Old name | New name |
|---|---|
| `addProductToRedis` | `createProduct` |
| `updateProductInRedis` | `updateProduct` |
| `deleteProductFromRedis` | `deleteProduct` |

### Case Studies
| Old name | New name |
|---|---|
| `addCaseStudyToRedis` | `createCaseStudy` |
| `updateCaseStudyInRedis` | `updateCaseStudy` |
| `deleteCaseStudyFromRedis` | `deleteCaseStudy` |

### Blogs
| Old name | New name |
|---|---|
| `addBlogToRedis` | `createBlog` |
| `updateBlogInRedis` | `updateBlog` |
| `deleteBlogFromRedis` | `deleteBlog` |

### Testimonials
| Old name | New name |
|---|---|
| `addTestimonialToRedis` | `createTestimonial` |
| `updateTestimonialInRedis` | `updateTestimonial` |
| `deleteTestimonialFromRedis` | `deleteTestimonial` |

### Categories
| Old name | New name |
|---|---|
| `addCategoryToRedis` | `createCategory` |
| `updateCategoryInRedis` | `updateCategory` |
| `deleteCategoryFromRedis` | `deleteCategory` |

### Subcategories
| Old name | New name |
|---|---|
| `addSubcategoryToRedis` | `createSubcategory` |
| `updateSubcategoryInRedis` | `updateSubcategory` |
| `deleteSubcategoryFromRedis` | `deleteSubcategory` |

### Materials
| Old name | New name |
|---|---|
| `addMaterialToRedis` | `createMaterial` |
| `updateMaterialInRedis` | `updateMaterial` |
| `deleteMaterialFromRedis` | `deleteMaterial` |

### Finish Categories
| Old name | New name |
|---|---|
| `addFinishCategoryToRedis` | `createFinishCategory` |
| `updateFinishCategoryInRedis` | `updateFinishCategory` |
| `deleteFinishCategoryFromRedis` | `deleteFinishCategory` |

### Finishes
| Old name | New name |
|---|---|
| `addFinishToRedis` | `createFinish` |
| `updateFinishInRedis` | `updateFinish` |
| `deleteFinishFromRedis` | `deleteFinish` |

### Hero Images
| Old name | New name |
|---|---|
| `getHeroImagesFromRedis` | `getHeroImages` |
| `setHeroImagesInRedis` | `setHeroImages` |

### Legacy / Compat (can be deleted)
| Function | Status |
|---|---|
| `isRedisInitialized` | Safe to delete — returns `products.length > 0` stub |
| `migrateLocalStorageToRedis` | Safe to delete — returns `{ products: 0, caseStudies: 0 }` stub |

---

## Local Development

```bash
# Terminal 1 – frontend
npm run dev          # Vite on http://localhost:8080

# Terminal 2 – backend
npm run server       # Express on http://localhost:3001

# One-time – run DB migrations
npm run server:migrate
```

The Vite proxy (`vite.config.ts`) forwards all `/api/*` requests from port 8080 to 3001:

```ts
proxy: {
  "/api": {
    target: "http://localhost:3001",
    changeOrigin: true,
  },
},
```

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `AggregateError` on `/api/*` proxy | Express server not running | `npm run server` |
| `ER_NO_SUCH_TABLE: categories` | Migration not applied | `npm run server:migrate` |
| `ER_NO_SUCH_TABLE: hero_images` | Migration not applied | `npm run server:migrate` |
| `Access denied for user` | Wrong `.env` credentials | Check `MYSQL_USER` / `MYSQL_PASSWORD` |
