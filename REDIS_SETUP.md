# Hindonix - Redis & Cloudinary Integration Setup

This guide will help you set up Upstash Redis and Cloudinary for product and case study management.

## Prerequisites

- Node.js and npm installed
- Upstash Redis account (free tier available)
- Cloudinary account (free tier available)

## Step 1: Set up Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database (choose the free tier if available)
3. Once created, go to the database details page
4. Copy the **REST URL** and **REST TOKEN** (you'll need these for the `.env.local` file)

## Step 2: Set up Cloudinary

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up or log in to your account
3. From the dashboard, note your **Cloud Name**
4. Go to Settings → Upload → Add upload preset
5. Create an **unsigned upload preset** (name it something like `hindonix_upload`)
6. Set the upload preset to **unsigned** mode and save
7. Copy the **Cloud Name** and **Upload Preset Name**

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual credentials:

```env
# Upstash Redis Configuration
VITE_UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
VITE_UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token_here

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

## Step 4: Install Dependencies

```bash
npm install
```

Dependencies already installed:
- `@upstash/redis` - Upstash Redis client

## Step 5: Seed Initial Data (Optional)

If you want to populate Redis with the default products and case studies:

1. Open the browser console when on the Admin page
2. Run the following command:

```javascript
// In browser console
import { migrateLocalStorageToRedis } from './src/lib/redis';
await migrateLocalStorageToRedis();
```

Or use the migration function from your code to seed Redis with default data from `data.ts`.

## Step 6: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Features Implemented

### Redis Integration
- **Individual hash keys per product**: Each product is stored as `hindonix:products:{id}`
- **Set-based ID tracking**: Product IDs are tracked in `hindonix:products:ids` set
- **Efficient querying**: Parallel batch fetching of products
- **Same pattern for case studies**: `hindonix:case_studies:{id}` with ID set

### Cloudinary Integration
- **Image upload**: Direct upload from Admin page to Cloudinary
- **URL storage**: Cloudinary URLs stored in Redis (not base64)
- **Upload feedback**: Loading states and progress indicators
- **Error handling**: Proper error messages for upload failures

### Admin Page Features
- **Async operations**: All CRUD operations are now async with Redis
- **Loading states**: Spinners and disabled buttons during operations
- **Image uploads**: Cloudinary integration with upload progress
- **Error handling**: Toast notifications for errors
- **Real-time updates**: Products and case studies refresh after operations

### Products & Case Studies Pages
- **Async data fetching**: Data loaded from Redis on page load
- **Loading indicators**: Spinner shown while fetching data
- **Error handling**: Console logging and graceful fallbacks

## Data Structure in Redis

### Products
- **Hash Key**: `hindonix:products:{id}`
- **Fields**: `id`, `name`, `category`, `subcategory`, `description`, `image` (URL), `finishes` (JSON string)
- **ID Set**: `hindonix:products:ids` (set of all product IDs)

### Case Studies
- **Hash Key**: `hindonix:case_studies:{id}`
- **Fields**: `id`, `title`, `client`, `category`, `location`, `image` (URL), `problem`, `solution`, `outcome`, `stats` (JSON string)
- **ID Set**: `hindonix:case_studies:ids` (set of all case study IDs)

## Troubleshooting

### Redis Connection Issues
- Verify your Upstash Redis URL and token in `.env.local`
- Check browser console for error messages
- Ensure environment variables start with `VITE_` prefix (required for Vite)

### Cloudinary Upload Errors
- Verify your Cloud Name and Upload Preset in `.env.local`
- Ensure the upload preset is set to **unsigned** mode
- Check image file size (Cloudinary free tier has limits)
- Check browser console for detailed error messages

### Data Not Showing
- Ensure Redis has been initialized with data
- Check browser console for API errors
- Verify environment variables are correctly set
- Clear browser cache and reload

## Migration from localStorage

If you have existing data in localStorage and want to migrate to Redis:

1. The old localStorage keys are: `hindonix_products` and `hindonix_case_studies`
2. Use the migration function in `src/lib/redis.ts`:

```typescript
import { migrateLocalStorageToRedis } from '@/lib/redis';

// Call this once to migrate
const result = await migrateLocalStorageToRedis();
console.log(`Migrated ${result.products} products and ${result.caseStudies} case studies`);
```

## Security Note

⚠️ **Important**: Since this is a client-side application, the Upstash Redis credentials are exposed in the frontend code. For production use, consider:

1. Adding authentication to the Admin page
2. Using Upstash's access control features to restrict operations
3. Implementing a backend API layer to proxy Redis operations
4. Using environment-specific Redis databases (dev/staging/prod)

## Next Steps

- Add authentication for Admin page access
- Implement image deletion from Cloudinary
- Add pagination for large product lists
- Implement search and advanced filtering in Redis
- Add caching strategy for frequently accessed data
