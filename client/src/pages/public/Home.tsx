import { useClinicRender } from "@/hooks/use-clinic";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/clinic/HeroSection";
import { ServicesSection } from "@/components/clinic/ServicesSection";
import { DoctorsSection } from "@/components/clinic/DoctorsSection";
import { FAQSection } from "@/components/clinic/FAQSection";
import { ReviewsSection } from "@/components/clinic/ReviewsSection";
import { Loader2, MapPin } from "lucide-react";

import { useForm } from "react-hook-form";
import { api } from "@shared/routes";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { data, isLoading, error } = useClinicRender();
  const form = useForm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-slate-600">
        <p>Failed to load clinic site. Please try again later.</p>
      </div>
    );
  }

  const { config } = data;

  const onContactSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await fetch(api.messages.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
      form.reset();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeroSection
        clinicName={config.clinic_name}
        heroImage={config.media?.hero_image}
        heroHeading={config.hero_heading}
        heroSubtext={config.hero_subtext}
      />
      <ServicesSection services={config.services} />
      <DoctorsSection doctors={config.doctors} />
      <ReviewsSection reviews={config.reviews} />
      {config.features?.enable_faq && <FAQSection faqs={config.faq} />}
      <section
        id="contact"
        className="py-12 lg:py-24 bg-slate-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 lg:mb-16">
              <h2 className="text-primary font-bold tracking-wider uppercase text-xs lg:text-sm mb-2 lg:mb-3">
                Get In Touch
              </h2>
              <h3 className="text-3xl lg:text-4xl font-bold font-display text-slate-900">
                Contact Us
              </h3>
              <div className="w-10 lg:w-12 h-1 bg-primary mx-auto mt-3 lg:mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Contact Info Card - Order 1 on mobile */}
              <div className="lg:col-span-4 space-y-6 lg:space-y-4 order-1">
                <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                  <h4 className="text-xl font-bold mb-6 text-slate-900">
                    Contact Information
                  </h4>
                  <div className="space-y-6">
                    {config.contact?.address && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                            Our Location
                          </p>
                          <p className="text-slate-600 text-sm mt-1">
                            {config.contact.address}
                          </p>
                        </div>
                      </div>
                    )}
                    {config.contact?.phone && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 {2.81}.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                            Phone Number
                          </p>
                          <p className="text-slate-600 text-sm mt-1">
                            {config.contact.phone}
                          </p>
                        </div>
                      </div>
                    )}
                    {config.contact?.email && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                            Email Address
                          </p>
                          <p className="text-slate-600 text-sm mt-1">
                            {config.contact.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Google Map - Order 3 on mobile */}
                <div className="h-[300px] bg-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 relative group lg:block hidden">
                  {config.contact?.google_maps_embed ? (
                    <iframe
                      src={config.contact.google_maps_embed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 bg-slate-100">
                      <div className="text-center">
                        <MapPin className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">
                          Map not configured
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Form Card - Order 2 on mobile */}
              <div className="lg:col-span-8 bg-transparent lg:bg-white p-0 lg:p-10 rounded-3xl lg:shadow-xl lg:shadow-slate-200/50 lg:border lg:border-slate-100 order-2">
                <h4 className="text-2xl font-bold mb-8 text-slate-900">
                  Send us a message
                </h4>
                <form
                  onSubmit={form.handleSubmit(onContactSubmit)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Your Name
                    </label>
                    <input
                      required
                      placeholder="Full Name"
                      className="w-full px-5 py-4 border border-slate-200 lg:border-slate-100 rounded-xl lg:rounded-2xl bg-white lg:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      {...form.register("name")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Email Address
                    </label>
                    <input
                      required
                      placeholder="email@example.com"
                      type="email"
                      className="w-full px-5 py-4 border border-slate-200 lg:border-slate-100 rounded-xl lg:rounded-2xl bg-white lg:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      {...form.register("email")}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Your Message
                    </label>
                    <textarea
                      required
                      placeholder="How can we help you?"
                      className="w-full px-5 py-4 border border-slate-200 lg:border-slate-100 rounded-xl lg:rounded-2xl bg-white lg:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none h-40 resize-none"
                      {...form.register("message")}
                    />
                  </div>
                  <div className="md:col-span-2 pt-2">
                    <button
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl lg:rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />{" "}
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Mobile Only Map - Order 3 */}
              <div className="lg:hidden block order-3 w-full">
                <div className="h-[300px] bg-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 relative group">
                  {config.contact?.google_maps_embed ? (
                    <iframe
                      src={config.contact.google_maps_embed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 bg-slate-100">
                      <div className="text-center">
                        <MapPin className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">
                          Map not configured
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
