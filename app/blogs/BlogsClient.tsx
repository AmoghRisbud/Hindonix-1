"use client";

import Link from "next/link";
import { ImageDisplay } from "@/components/ImageDisplay";
import { type Blog } from "@/lib/data";

interface BlogsClientProps {
  initialBlogs: Blog[];
}

export function BlogsClient({ initialBlogs }: BlogsClientProps) {
  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">Blogs</span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Latest Insights & Articles</h1>
            <p className="text-lg text-primary-foreground/80">Explore our latest blog posts and stay updated with industry insights.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {initialBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No blogs published yet.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {initialBlogs.map((blog, index) => (
                <Link key={blog.id} href={`/blogs/${blog.id}`} className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300">
                  <div className="aspect-[16/9] overflow-hidden">
                    <ImageDisplay src={blog.image} alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 lg:p-8">
                    <p className="text-foreground leading-relaxed line-clamp-3">{blog.content}</p>
                    <p className="text-accent text-sm font-medium mt-4">Read more →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
