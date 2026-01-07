import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDisplay } from "@/components/ImageDisplay";
import { useState, useEffect } from "react";
import { getBlogs, type Blog } from "@/lib/data";
import { X } from "lucide-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const blogsData = await getBlogs();
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error loading blogs:', error);
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
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <ImageDisplay
                      src={blog.image}
                      alt="Blog"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 lg:p-8">
                    <p className="text-foreground leading-relaxed line-clamp-3">
                      {blog.content}
                    </p>
                    <p className="text-accent text-sm font-medium mt-4">Read more →</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBlog(null)}
        >
          <div 
            className="bg-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex justify-between items-center">
              <h2 className="font-heading text-2xl font-bold text-foreground">Blog Details</h2>
              <button
                onClick={() => setSelectedBlog(null)}
                className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="p-6 lg:p-8">
              <div className="w-full max-w-md mx-auto mb-6 rounded-xl overflow-hidden">
                <ImageDisplay
                  src={selectedBlog.image}
                  alt="Blog"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedBlog.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default Blogs;
