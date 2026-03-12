import { motion } from "framer-motion";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: string;
  duration?: string;
  image_url?: string;
}

interface ServicesSectionProps {
  services?: Service[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0, 1],
    },
  },
};

export function ServicesSection({ services, className }: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <section
      id="services"
      className={cn(
        "py-12 md:py-16 lg:py-24 bg-gradient-to-b from-slate-50/80 to-white relative overflow-hidden",
        className,
      )}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary font-bold tracking-wider uppercase text-xs lg:text-sm mb-2 lg:mb-3">
              Expert Medical Care
            </h2>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold font-display text-slate-900"
          >
            Our Services
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-10 lg:w-12 h-1 bg-primary mx-auto mt-3 lg:mt-4 rounded-full"
          ></motion.div>
        </div>

        {/* Services Grid - Adjusted for desktop width */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="group h-full w-full max-w-sm mx-auto lg:max-w-none"
            >
              <Link href={`/service/${service.id}`}>
                <Card className="h-full border-0 bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 rounded-2xl overflow-hidden flex flex-col cursor-pointer relative">
                  {/* Service Image - Fixed height */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                    {service.image_url ? (
                      <>
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary/30">
                            {service.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Category Badge */}
                    {service.category && (
                      <Badge className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm text-slate-700 border-0 shadow-md px-2.5 py-1 text-xs font-semibold rounded-full">
                        {service.category}
                      </Badge>
                    )}
                  </div>

                  {/* Content - Compact spacing */}
                  <CardContent className="p-3.5 flex flex-col">
                    {/* Service Name */}
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {service.name}
                    </h3>

                    {/* Description - Limited to 2 lines */}
                    {service.description && (
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-2.5 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    {/* Duration & Price - Side by side */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {service.duration ? (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-primary/60" />
                          <span className="text-xs font-medium">
                            {service.duration}
                          </span>
                        </div>
                      ) : (
                        <div /> /* Empty div for spacing when no duration */
                      )}

                      {service.price && (
                        <span className="text-xs md:text-sm font-bold text-primary">
                          {service.price}
                        </span>
                      )}
                    </div>

                    {/* CTA - Minimal */}
                    <div className="flex items-center justify-end mt-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </CardContent>

                  {/* Subtle border on hover */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-200 group-hover:ring-primary/30 transition-colors duration-500 pointer-events-none" />
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Services CTA */}
        {services.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12 md:mt-16"
          >
            <Link href="/services">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-primary/30 rounded-full text-slate-700 hover:text-primary font-semibold text-sm transition-all duration-300 group shadow-md hover:shadow-lg">
                <span>View All Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
