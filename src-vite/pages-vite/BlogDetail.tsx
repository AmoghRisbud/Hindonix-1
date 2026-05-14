import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { getBlogs, type Blog } from "@/lib/data";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromUrl = searchParams.get("from") || "/blogs";
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogs = await getBlogs();
        const found = blogs.find((b) => b.id === Number(id));
        if (found) {
          setBlog(found);
        } else {
          navigate("/blogs");
        }
      } catch (err) {
        navigate("/blogs");
      }
    };
    loadBlog();
  }, [id, navigate]);

  if (!blog) return null;

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate(fromUrl)}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl overflow-hidden">
              <ImageDisplay
                src={blog.image}
                alt="Blog"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="pt-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BlogDetail;
