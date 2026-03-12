import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

interface HeroSectionProps {
  clinicName: string;
  heroImage?: string;
  heroHeading?: string;
  heroSubtext?: string;
}

export function HeroSection({
  clinicName,
  heroImage,
  heroHeading,
  heroSubtext,
}: HeroSectionProps) {
  {
    /* landing page hero modern bright medical clinic interior */
  }
  const defaultHero =
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop";
  const bgImage = heroImage || defaultHero;

  return (
    <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Clinic Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 lg:px-16">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
              Welcome to {clinicName}
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 font-display leading-[1.1] mb-6 tracking-tight">
              {heroHeading ? (
                heroHeading
              ) : (
                <>
                  <span className="text-gradient">Medical Care</span> You Can
                  Trust
                </>
              )}
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              {heroSubtext ||
                "Experience healthcare reimagined. We combine state-of-the-art medical technology with compassionate, patient-centered care."}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/appointment">
                <button className="px-6 py-3 lg:px-8 lg:py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base lg:text-lg shadow-lg shadow-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex items-center gap-2">
                  Book Appointment <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button
                onClick={() => {
                  const el = document.getElementById("services");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-bold text-sm lg:text-base hover:bg-white hover:border-primary/30 transition-all duration-300"
              >
                Our Services
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> Top
                Specialists
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> Modern
                Facilities
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> 24/7 Support
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
