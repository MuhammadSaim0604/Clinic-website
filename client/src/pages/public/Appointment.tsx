import { useForm } from "react-hook-form";
import { useClinicRender } from "@/hooks/use-clinic";
import { api } from "@shared/routes";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Appointment() {
  const { data, isLoading } = useClinicRender();
  const [submitted, setSubmitted] = useState(false);
  const form = useForm();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Failed to load clinic data.
      </div>
    );

  const { config } = data;

  const onSubmit = async (data: any) => {
    try {
      await fetch(api.appointments.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Appointment Requested!</h1>
        <p className="text-slate-600 mb-12 text-lg">
          Thank you for choosing {config.clinic_name}. We have received your
          request and will contact you shortly to confirm your appointment.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-xl px-12">
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950/50 max-h-screen pt-4 md:pt-12 pb-12 md:pb-20">
      <div className="container mx-auto px-0 md:px-4 max-w-2xl">
        <div className="bg-white dark:bg-slate-900 md:rounded-3xl p-6 md:p-10 md:shadow-xl md:shadow-slate-200/50 dark:shadow-none md:border md:border-slate-100 dark:md:border-slate-800">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 px-1 md:px-0">
            Book an Appointment
          </h1>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 mb-8 md:mb-12 px-1 md:px-0">
            Schedule your visit at {config.clinic_name} quickly and easily.
          </p>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 md:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                  Full Name
                </label>
                <input
                  required
                  className="w-full px-4 py-3 md:px-5 md:py-4 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm md:text-base"
                  {...form.register("name")}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                  Email Address
                </label>
                <input
                  required
                  className="w-full px-4 py-3 md:px-5 md:py-4 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm md:text-base"
                  type="email"
                  {...form.register("email")}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Select Service
              </label>
              <select
                required
                className="w-full px-4 py-3 md:px-5 md:py-4 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm md:text-base"
                {...form.register("service")}
              >
                <option value="">Choose a service...</option>
                {config.services?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {config.clinic_type === "dental" && (
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                  Tooth Number or Area (Optional)
                </label>
                <input
                  className="w-full px-4 py-3 md:px-5 md:py-4 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm md:text-base"
                  {...form.register("tooth")}
                  placeholder="e.g. Upper Left"
                />
              </div>
            )}

            {config.clinic_type === "maternity" && (
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                  Estimated Due Date / Weeks (Optional)
                </label>
                <input
                  className="w-full px-4 py-3 md:px-5 md:py-4 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm md:text-base"
                  {...form.register("maternity_info")}
                  placeholder="e.g. 24 weeks"
                />
              </div>
            )}

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Preferred Appointment Date
              </label>
              <input
                required
                className="w-full px-4 py-3 md:px-5 md:py-4 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm md:text-base"
                type="date"
                {...form.register("date")}
              />
            </div>

            <div className="pt-4 md:pt-6 px-1 md:px-0">
              <Button
                type="submit"
                className="w-full h-12 md:h-16 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Request My Appointment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
