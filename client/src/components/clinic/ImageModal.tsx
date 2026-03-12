import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

interface Image {
  id: string;
  path: string;
  originalName?: string;
  createdAt?: string;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imagePath: string | string[]) => void;
  multiple?: boolean;
}

export function ImageModal({ isOpen, onClose, onSelect, multiple = false }: ImageModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["/api/images/recent"],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await fetch(
          `/api/images/recent?limit=20&offset=${pageParam}`
        );
        return response.json();
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 20 ? allPages.length * 20 : undefined;
      },
      initialPageParam: 0,
      enabled: isOpen,
    });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const response = await apiRequest("POST", "/api/images/upload", {
              imageData: e.target?.result,
              fileName: file.name,
            });
            resolve(response.path);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
      });
    },
    onSuccess: async (path) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/images/recent"] });
      await refetch();
      if (!multiple) {
        onSelect(path);
        onClose();
      } else {
        setSelectedPaths(prev => [...prev, path]);
      }
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      uploadMutation.mutate(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const toggleSelection = (path: string) => {
    if (!multiple) {
      setSelectedPaths([path]);
      return;
    }
    setSelectedPaths(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleConfirm = () => {
    if (multiple) {
      onSelect(selectedPaths);
    } else if (selectedPaths.length > 0) {
      onSelect(selectedPaths[0]);
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedPaths([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allImages = data?.pages.flat() || [];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Media Library</h2>
            {multiple && selectedPaths.length > 0 && (
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                {selectedPaths.length} selected
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Grid and Upload */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload New
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
            </div>

            <div 
              ref={scrollContainerRef}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`flex-1 overflow-y-auto p-4 relative ${dragActive ? 'bg-primary/5 ring-2 ring-primary ring-inset' : ''}`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p>Loading library...</p>
                </div>
              ) : allImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p>No images found. Upload your first one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {allImages.map((image: Image) => (
                    <div 
                      key={image.id}
                      onClick={() => toggleSelection(image.path)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 transition-all ${
                        selectedPaths.includes(image.path) 
                          ? "border-primary ring-2 ring-primary/20" 
                          : "border-transparent hover:border-slate-300"
                      }`}
                    >
                      <img src={image.path} className="w-full h-full object-cover" alt="" />
                      {selectedPaths.includes(image.path) && (
                        <div className="absolute top-1.5 right-1.5 bg-primary text-white rounded-full p-0.5 shadow-lg">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Info & Actions */}
          <div className="w-64 bg-slate-50/50 p-6 flex flex-col gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Selection Info</h3>
              {selectedPaths.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <img src={selectedPaths[selectedPaths.length - 1]} className="w-full h-full object-contain" alt="" />
                  </div>
                  <p className="text-xs text-slate-500 break-all font-mono bg-white p-2 rounded border border-slate-200">
                    {selectedPaths[selectedPaths.length - 1]}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No image selected</p>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleConfirm} 
                className="w-full gap-2 font-bold" 
                disabled={selectedPaths.length === 0}
              >
                {multiple ? "Insert Images" : "Select Image"}
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full text-slate-500">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
