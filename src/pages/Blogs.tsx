import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDisplay } from "@/components/ImageDisplay";
import { useState, useEffect } from "react";
import { getBlogs, type Blog } from "@/lib/data";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  // Modal removed; navigate to detail page instead

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const blogsData = await getBlogs();
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error loading blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Blogs
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Latest Insights & Articles
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Explore our latest blog posts and stay updated with industry
              insights.
            </p>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No blogs published yet.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {blogs.map((blog, index) => {
                const blogUrl = `/blogs/${blog.id}?from=/blogs`;
                return (
                  <Link
                    key={blog.id}
                    to={blogUrl}
                    className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <ImageDisplay
                        src={blog.image}
                        alt="Blog"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      />
                    </div>
                    <div className="p-6 lg:p-8">
                      <p className="text-foreground leading-relaxed line-clamp-3">
                        {blog.content}
                      </p>
                      <p className="text-accent text-sm font-medium mt-4">
                        Read more →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blogs;
