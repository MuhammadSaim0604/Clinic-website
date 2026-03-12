import { useState } from "react";
import { useClinicRender } from "@/hooks/use-clinic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function BlogsPage() {
  const { data, isLoading } = useClinicRender();
  const [blogs, setBlogs] = useState<any[]>([]);

  // Fetch blogs
  useState(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  });

  if (isLoading) return null;

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Our Journal</h2>
          <h1 className="text-4xl lg:text-5xl font-bold font-display text-slate-900 mb-4">Latest Health News & Insights</h1>
          <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/blog/${blog.slug}`}>
                <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer group">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={blog.thumbnail || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800"} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={blog.title} 
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 border-0">{blog.category || "Health"}</Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {blog.author || "Admin"}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h2>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
