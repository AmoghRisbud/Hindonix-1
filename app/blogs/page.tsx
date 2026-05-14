export const dynamic = 'force-dynamic';

import { getBlogs } from "@/lib/data";
import { BlogsClient } from "./BlogsClient";

export default async function BlogsPage() {
  const blogs = await getBlogs().catch(() => []);
  return <BlogsClient initialBlogs={blogs} />;
}
