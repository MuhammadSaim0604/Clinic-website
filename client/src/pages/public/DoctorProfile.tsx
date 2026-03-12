import { useClinicRender } from "@/hooks/use-clinic";
import { useParams, Link } from "wouter";
import { Loader2, ArrowLeft, GraduationCap, Languages, Briefcase, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorProfile() {
  const { id } = useParams();
  const { data, isLoading } = useClinicRender();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!data || !data.config.doctors) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-slate-600">
        <p>Doctor not found.</p>
      </div>
    );
  }

  const doctor = data.config.doctors.find((d) => d.id === id);
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-slate-600">
        <p>Doctor not found.</p>
      </div>
    );
  }

  const doctorServices = data.config.services?.filter(s => doctor.service_ids?.includes(s.id)) || [];

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950/50 pt-4 md:pt-8 pb-12 md:pb-24 min-h-screen">
      <div className="container mx-auto px-0 md:px-4">
        <div className="px-4 md:px-0">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 md:mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Profile Header Card */}
          <div className="bg-white dark:bg-slate-900 md:rounded-[2.5rem] p-6 md:p-10 md:shadow-xl md:shadow-slate-200/50 dark:shadow-none md:border border-slate-100 dark:border-slate-800 mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-center">
              {/* Profile Picture Wrapper */}
              <div className="relative group w-full md:w-auto flex justify-center">
                <div className="relative w-40 h-40 md:w-64 md:h-64 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl md:shadow-2xl ring-4 md:ring-8 ring-slate-50 dark:ring-slate-800/50 group-hover:ring-primary/10 transition-all duration-500">
                  <img 
                    src={doctor.photo_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800"} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-2 md:-bottom-4 right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 bg-primary text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full font-bold shadow-lg text-[10px] md:text-sm whitespace-nowrap">
                  Verified Expert
                </div>
              </div>

              {/* Profile Info Content */}
              <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left w-full">
                <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2 md:mb-3 tracking-tight leading-tight">
                    {doctor.name}
                  </h1>
                  <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 bg-primary/10 text-primary rounded-full text-[10px] md:text-sm font-bold uppercase tracking-wider mb-4 md:mb-6">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse" />
                    {doctor.specialty}
                  </div>
                  <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto md:mx-0">
                    {doctor.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 md:gap-6 pt-2">
                  {doctor.experience && (
                    <div className="flex items-center gap-3 px-4 py-2.5 md:px-5 md:py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-colors group">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-slate-400 font-bold">Experience</p>
                        <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">{doctor.experience}</p>
                      </div>
                    </div>
                  )}
                  {doctor.qualifications && (
                    <div className="flex items-center gap-3 px-4 py-2.5 md:px-5 md:py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-colors group">
                      <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-slate-400 font-bold">Qualification</p>
                        <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">{doctor.qualifications}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 max-w-sm mx-auto md:mx-0">
                  <Link href="/appointment">
                    <Button className="w-full h-12 md:h-16 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg md:shadow-xl md:shadow-primary/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group overflow-hidden relative">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                        Book Consult Now
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-4 md:px-0">
            {/* Detailed Bio Section */}
            <section className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] md:shadow-xl md:shadow-slate-200/50 dark:shadow-none md:border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Professional Profile</h2>
              </div>
              <div className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                {doctor.full_bio ? (
                  <p className="whitespace-pre-wrap">{doctor.full_bio}</p>
                ) : (
                  <p>Dr. {doctor.name} is a dedicated professional specializing in {doctor.specialty}, providing world-class healthcare with a focus on patient well-being and clinical excellence.</p>
                )}
              </div>
            </section>

            {/* Education & Services Section */}
            <div className="space-y-4 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              {doctor.education && doctor.education.length > 0 && (
                <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] md:shadow-xl md:shadow-slate-200/50 dark:shadow-none md:border border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6 flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    Academic Background
                  </h2>
                  <div className="space-y-3 md:space-y-4">
                    {doctor.education.map((edu, idx) => (
                      <div key={idx} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">{edu}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {doctorServices.length > 0 && (
                <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] md:shadow-xl md:shadow-slate-200/50 dark:shadow-none md:border border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    Specialized Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {doctorServices.map((service) => (
                      <div key={service.id} className="px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 text-primary font-bold text-[10px] md:text-sm hover:bg-primary hover:text-white transition-all duration-300 cursor-default">
                        {service.name}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
