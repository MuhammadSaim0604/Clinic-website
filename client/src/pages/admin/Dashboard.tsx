import { useClinicConfig } from "@/hooks/use-clinic";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ClinicConfigForm } from "@/components/admin/ClinicConfigForm";
import { Loader2, AlertCircle } from "lucide-react";
export default function Dashboard() {
  console.log("Dashboard :", "Dashboard");
  const { data, isLoading: configLoading, error } = useClinicConfig();

  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <span className="font-medium">
            Failed to load configuration. Backend might be down.
          </span>
        </div>
      </AdminLayout>
    );
  }

  return <ClinicConfigForm initialData={data.config} />;
}
