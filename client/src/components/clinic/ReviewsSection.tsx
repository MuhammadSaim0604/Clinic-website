import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  profile_picture?: string;
  time_ago?: string;
}

interface ReviewsSectionProps {
  reviews?: Review[];
}

export function ReviewsSection({ reviews = [] }: ReviewsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const itemsPerView = 3;
  const totalSlides = Math.ceil(reviews.length / itemsPerView);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const visibleReviews = reviews.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header with Google branding */}
          <div className="text-center mb-10 lg:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className="text-primary font-bold tracking-wider uppercase text-xs lg:text-sm">
                Verified Reviews on
              </h2>
              <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 via-blue-500 via-green-500 to-red-500 bg-clip-text">
                <span className="text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 via-blue-500 via-green-500 to-red-500 bg-clip-text">
                  Google
                </span>
              </div>
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold font-display text-slate-900 mb-3">
              What Our Patients Say
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Trusted reviews from our satisfied patients about their experiences with our clinic
            </p>
          </div>

          {/* Reviews Carousel */}
          <div className="relative">
            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {review.profile_picture ? (
                          <img
                            src={review.profile_picture}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{review.name}</p>
                          <p className="text-xs text-slate-500">{review.time_ago || "1 day ago"}</p>
                        </div>
                      </div>
                    </div>
                    <FaGoogle className="text-slate-400 w-5 h-5" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {review.review}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full border border-slate-200 hover:border-primary hover:bg-primary/10 transition-all"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {[...Array(totalSlides)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentIndex
                          ? "bg-primary w-8"
                          : "bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full border border-slate-200 hover:border-primary hover:bg-primary/10 transition-all"
                  aria-label="Next reviews"
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
