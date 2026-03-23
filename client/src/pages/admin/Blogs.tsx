import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Blog } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import JoditEditor from "jodit-react";
import parse from "html-react-parser";

const JODIT_CONFIG = {
  readonly: false,
  height: 400,
  toolbarSticky: true,
  buttons: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "heading",
    "paragraph",
    "|",
    "ul",
    "ol",
    "indent",
    "outdent",
    "|",
    "align",
    "|",
    "link",
    "image",
    "video",
    "|",
    "blockquote",
    "code",
    "hr",
    "|",
    "undo",
    "redo",
    "|",
    "source",
  ],
  placeholder: "Start writing your blog post...",
};

export default function AdminBlogs() {
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const editorRef = useRef(null);

  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ["/api/blogs"],
  });

  const saveMutation = useMutation({
    mutationFn: async (blog: Partial<Blog>) => {
      const url = blog.id ? `/api/blogs/${blog.id}` : "/api/blogs";
      const method = blog.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      setEditingBlog(null);
      toast({ title: "Success", description: "Blog saved successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      toast({ title: "Deleted", description: "Blog removed" });
    },
  });

  const handleSave = () => {
    if (!editingBlog) return;
    saveMutation.mutate(editingBlog);
  };

  if (editingBlog) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setEditingBlog(null)}
              className="gap-2 rounded-xl hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <div className="h-6 w-px bg-slate-200" />
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="gap-2 rounded-xl"
            >
              {previewMode ? (
                <>
                  <EyeOff className="w-4 h-4" /> Edit Mode
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" /> Preview
                </>
              )}
            </Button>
          </div>
          <Button
            onClick={handleSave}
            className="gap-2 rounded-xl bg-primary hover:bg-primary/90 px-6"
            disabled={saveMutation.isPending}
          >
            <Save className="w-4 h-4" />
            {saveMutation.isPending ? "Saving..." : "Save Blog"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-700">Blog Content</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Write your blog post using the rich text editor below
                </p>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Blog Title
                  </label>
                  <input
                    value={editingBlog.title || ""}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        title: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-"),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
                    placeholder="Enter an engaging title..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Content
                  </label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white jodit-container">
                    {!previewMode ? (
                      <JoditEditor
                        ref={editorRef}
                        value={editingBlog.content || ""}
                        config={JODIT_CONFIG}
                        onBlur={(newContent) =>
                          setEditingBlog({ ...editingBlog, content: newContent })
                        }
                        onChange={(newContent) =>
                          setEditingBlog({ ...editingBlog, content: newContent })
                        }
                      />
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Use the toolbar above to format your content. You can add
                    headings, lists, links, images, and more.
                  </p>
                </div>

                {previewMode && (
                  <div className="mt-6 p-8 bg-slate-50 rounded-xl border border-slate-200 prose prose-lg prose-slate max-w-none">
                    <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Preview
                    </h4>
                    <div className="blog-preview-content">
                      {parse(editingBlog.content || "")}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-700">Blog Settings</h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    Thumbnail URL
                  </label>
                  <div className="relative">
                    <input
                      value={editingBlog.thumbnail || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          thumbnail: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all pl-10"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Category
                  </label>
                  <input
                    value={editingBlog.category || ""}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g. Health Tips"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Author
                  </label>
                  <input
                    value={editingBlog.author || ""}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        author: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Dr. Smith"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Status</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        editingBlog.published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {editingBlog.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 rounded-xl border-slate-200"
                    onClick={() =>
                      setEditingBlog({
                        ...editingBlog,
                        published: !editingBlog.published,
                      })
                    }
                  >
                    {editingBlog.published ? "Unpublish" : "Publish Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Manage Blogs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage your clinic's blog posts
          </p>
        </div>
        <Button
          onClick={() =>
            setEditingBlog({
              title: "",
              content: "",
              category: "",
              thumbnail: "",
              slug: "",
            })
          }
          className="gap-2 rounded-xl bg-primary hover:bg-primary/90 px-6"
        >
          <Plus className="w-4 h-4" /> New Blog Post
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="rounded-2xl border-slate-200 animate-pulse"
            >
              <div className="h-48 bg-slate-200" />
              <CardContent className="p-6">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <Card
              key={blog.id}
              className="group overflow-hidden rounded-2xl border-slate-200 hover:shadow-lg transition-all hover:border-primary/20"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setEditingBlog(blog)}
                    className="w-8 h-8 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this blog?")) {
                        if (blog.id) {
                          deleteMutation.mutate(blog.id);
                        }
                      }
                    }}
                    className="w-8 h-8 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-1 rounded-full">
                    {blog.category || "Uncategorized"}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-2 text-lg mb-2">
                  {blog.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown date"}
                </p>
              </CardContent>
            </Card>
          ))}

          {blogs?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No blog posts yet
              </h3>
              <p className="text-slate-500 mb-6">
                Create your first blog post to get started
              </p>
              <Button
                onClick={() =>
                  setEditingBlog({
                    title: "",
                    content: "",
                    category: "",
                    thumbnail: "",
                    slug: "",
                  })
                }
                className="gap-2 rounded-xl"
              >
                <Plus className="w-4 h-4" /> Create First Post
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
