import { useClinicRender } from "@/hooks/use-clinic";
import { useParams, Link } from "wouter";
import { Loader2, ArrowLeft, Clock, Banknote, Users, CheckCircle2, Calendar, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServiceDetails() {
  const { id } = useParams();
  const { data, isLoading } = useClinicRender();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!data || !data.config.services) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-slate-600">
        <p>Service not found.</p>
      </div>
    );
  }

  const service = data.config.services.find((s) => s.id === id);
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-slate-600">
        <p>Service not found.</p>
      </div>
    );
  }

  const providers = data.config.doctors?.filter(d => d.service_ids?.includes(service.id)) || [];

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950/50 pt-4 md:pt-8 pb-12 md:pb-24 min-h-screen">
      <div className="container mx-auto px-0 md:px-4">
        <div className="px-4 md:px-0">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 md:mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Services</span>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Hero Card */}
          <div className="bg-white dark:bg-slate-900 md:rounded-[2.5rem] overflow-hidden md:shadow-xl md:shadow-slate-200/50 dark:shadow-none md:border border-slate-100 dark:border-slate-800 mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row">
              {/* Service Image */}
              <div className="lg:w-1/2 relative h-[300px] lg:h-auto">
                <img 
                  src={service.image_url || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800"} 
                  alt={service.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                <div className="absolute bottom-6 left-6 lg:hidden">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 backdrop-blur-md text-white rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                    {service.category || "General Care"}
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">{service.name}</h1>
                </div>
              </div>

              {/* Service Details Header */}
              <div className="lg:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col">
                <div className="hidden lg:block mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    {service.category || "General Care"}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                    {service.name}
                  </h1>
                </div>

                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  {service.description || "Comprehensive medical care provided by our expert team of specialists using state-of-the-art technology."}
                </p>

                <div className="grid grid-cols-2 gap-4 md:gap-6 pt-2 mb-8">
                  {service.duration && (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group transition-colors hover:border-primary/20">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Duration</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{service.duration}</p>
                      </div>
                    </div>
                  )}
                  {service.price && (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group transition-colors hover:border-primary/20">
                      <Banknote className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Price</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{service.price}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <Link href="/appointment">
                    <Button className="w-full h-14 md:h-16 rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group">
                      <Calendar className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Book This Service
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-0">
            {/* Service Benefits/Info */}
            <div className="md:col-span-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2rem] md:shadow-xl md:shadow-slate-200/50 dark:shadow-none md:border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What to Expect</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                  <p>Our {service.name} service is designed to provide you with the most effective and comfortable experience possible. During your visit, you can expect:</p>
                  <ul className="space-y-3 list-none p-0">
                    {[
                      "Thorough initial consultation and assessment",
                      "Advanced diagnostic procedures using modern equipment",
                      "Personalized care plan tailored to your specific needs",
                      "Follow-up guidance and continuous support"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Service Providers */}
            <div className="md:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] md:shadow-xl md:shadow-slate-200/50 dark:shadow-none md:border border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  Expert Providers
                </h2>
                <div className="space-y-4">
                  {providers.length > 0 ? ( providers.map((doc) => (
                    <Link key={doc.id} href={`/doctor/${doc.id}`}>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 hover:border-primary/30 hover:bg-white transition-all cursor-pointer group">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md shrink-0 ring-2 ring-white dark:ring-slate-800 group-hover:ring-primary/20 transition-all">
                          <img src={doc.photo_url || "/1.jpeg"} alt={doc.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{doc.name}</h3>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-tight truncate">{doc.specialty}</p>
                        </div>
                      </div>
                    </Link>
                  ))) : (
                    <p className="text-sm text-slate-500 italic">No specific providers assigned yet.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
