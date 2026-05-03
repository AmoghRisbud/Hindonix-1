"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { type Blog } from "@/lib/data";

export function BlogDetailClient({ blog }: { blog: Blog }) {
  const router = useRouter();
  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl overflow-hidden">
              <ImageDisplay src={blog.image} alt="Blog" className="w-full h-[500px] object-cover" />
            </div>
            <div className="pt-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{blog.content}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
