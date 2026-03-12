import { useClinicRender } from "@/hooks/use-clinic";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

export default function GalleryPage() {
  const { data } = useClinicRender();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const galleryImages = data?.config?.media?.gallery_images || [];

  return (
    <div className="py-12 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">
            Our Facility
          </h2>
          <h1 className="text-4xl lg:text-5xl font-bold font-display text-slate-900 mb-4">
            Gallery
          </h1>
          <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Take a look at our modern medical facility, equipment, and clinic environment
          </p>
        </div>

        {/* Gallery Grid */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {galleryImages.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedImage(image)}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-square"
              >
                <img
                  src={image}
                  alt={`Gallery image ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <span className="text-white font-semibold">View Full Size</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No gallery images yet</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full"
          >
            <img
              src={selectedImage}
              alt="Gallery full size"
              className="w-full h-auto rounded-2xl shadow-2xl max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
