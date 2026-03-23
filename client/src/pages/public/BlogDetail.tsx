import { useClinicRender } from "@/hooks/use-clinic";
import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import parse from "html-react-parser";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return null;
  if (!blog) return <div className="py-24 text-center">Blog not found</div>;

  return (
    <div className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/blogs" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blogs
        </Link>
        
        <img 
          src={blog.thumbnail} 
          className="w-full h-[400px] object-cover rounded-[2.5rem] mb-12 shadow-2xl" 
          alt={blog.title} 
        />
        
        <div className="flex items-center gap-6 text-sm text-slate-400 mb-8">
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-2"><User className="w-4 h-4" /> {blog.author || "Admin"}</span>
          <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> {blog.category}</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-12 leading-tight">{blog.title}</h1>
        
        <div className="prose prose-lg prose-slate max-w-none blog-content-detail">
          {parse(blog.content || "")}
        </div>
      </div>

      <style>{`
        .blog-content-detail {
          word-break: normal !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
        }

        .blog-content-detail * {
          word-break: normal !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
        }

        .blog-content-detail p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
          color: #334155;
          font-size: 1.125rem;
        }

        .blog-content-detail h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #0f172a;
        }

        .blog-content-detail h2 {
          font-size: 2rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1.25rem;
          color: #0f172a;
        }

        .blog-content-detail h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 1rem;
          color: #0f172a;
        }

        .blog-content-detail h4, .blog-content-detail h5, .blog-content-detail h6 {
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #0f172a;
        }

        .blog-content-detail strong {
          font-weight: 700;
          color: #0f172a;
        }

        .blog-content-detail em {
          font-style: italic;
        }

        .blog-content-detail u {
          text-decoration: underline;
        }

        .blog-content-detail s {
          text-decoration: line-through;
        }

        .blog-content-detail ul, .blog-content-detail ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }

        .blog-content-detail ul li {
          list-style-type: disc;
          margin-bottom: 0.5rem;
          color: #334155;
        }

        .blog-content-detail ol li {
          list-style-type: decimal;
          margin-bottom: 0.5rem;
          color: #334155;
        }

        .blog-content-detail li {
          line-height: 1.8;
        }

        .blog-content-detail blockquote {
          border-left: 4px solid #00bcd4;
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          background: #f0f9fa;
          font-style: italic;
          color: #1e293b;
          border-radius: 0.5rem;
        }

        .blog-content-detail a {
          color: #00bcd4;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .blog-content-detail a:hover {
          color: #0097a7;
        }

        .blog-content-detail img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem 0;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          display: block;
        }

        .blog-content-detail table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }

        .blog-content-detail th {
          background: #f1f5f9;
          font-weight: 600;
          padding: 0.75rem 1rem;
          text-align: left;
          border: 1px solid #e2e8f0;
        }

        .blog-content-detail td {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
        }

        .blog-content-detail pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          font-family: "Monaco", "Menlo", "Consolas", monospace;
          font-size: 0.875rem;
          margin: 1.5rem 0;
          word-break: break-all;
          white-space: pre-wrap;
        }

        .blog-content-detail code {
          background: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 0.375rem;
          font-family: "Monaco", "Menlo", "Consolas", monospace;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .blog-content-detail video, .blog-content-detail iframe {
          max-width: 100%;
          height: auto;
          margin: 2rem 0;
          border-radius: 1rem;
        }

        @media (max-width: 768px) {
          .blog-content-detail h1 {
            font-size: 2rem;
          }

          .blog-content-detail h2 {
            font-size: 1.75rem;
          }

          .blog-content-detail h3 {
            font-size: 1.5rem;
          }

          .blog-content-detail p {
            font-size: 1rem;
            line-height: 1.7;
          }

          .blog-content-detail blockquote {
            padding: 1rem;
            margin: 1.5rem 0;
          }

          .blog-content-detail img {
            border-radius: 0.75rem;
            margin: 1.5rem 0;
          }
        }

        @media (max-width: 640px) {
          .blog-content-detail table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
