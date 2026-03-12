import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "./pages/public/Home";
import Appointment from "./pages/public/Appointment";
import DoctorProfile from "./pages/public/DoctorProfile";
import ServiceDetails from "./pages/public/ServiceDetails";
import BlogsPage from "./pages/public/Blogs";
import BlogDetail from "./pages/public/BlogDetail";
import GalleryPage from "./pages/public/Gallery";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import BlogsAdmin from "./pages/admin/Blogs";
import AppointmentsPage from "./pages/admin/Appointments";
import MessagesPage from "./pages/admin/Messages";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { useClinicRender } from "@/hooks/use-clinic";
import { Loader2 } from "lucide-react";

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  const { data, isLoading } = useClinicRender();

  if (isLoading && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const content = (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/appointment" component={Appointment} />
      <Route path="/doctor/:id" component={DoctorProfile} />
      <Route path="/service/:id" component={ServiceDetails} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/blogs" component={BlogsPage} />
      <Route path="/blog/:slug" component={BlogDetail} />

      <Route path="/admin" component={Login} />
      <Route path="/admin/dashboard">
        {() => (
          <ProtectedAdminRoute>
            <Dashboard />
          </ProtectedAdminRoute>
        )}
      </Route>
      <Route path="/admin/blogs">
        {() => (
          <ProtectedAdminRoute>
            <BlogsAdmin />
          </ProtectedAdminRoute>
        )}
      </Route>
      <Route path="/admin/appointments">
        {() => (
          <ProtectedAdminRoute>
            <AppointmentsPage />
          </ProtectedAdminRoute>
        )}
      </Route>
      <Route path="/admin/messages">
        {() => (
          <ProtectedAdminRoute>
            <MessagesPage />
          </ProtectedAdminRoute>
        )}
      </Route>

      <Route>
        {() => (
          <div className="min-h-screen flex items-center justify-center bg-background text-center p-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">404</h1>
              <p className="text-slate-500 mb-8">
                The page you're looking for doesn't exist.
              </p>
              <a
                href="/"
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        )}
      </Route>
    </Switch>
  );

  if (isAdmin) {
    if (location === "/admin") return content;
    return <AdminLayout>{content}</AdminLayout>;
  }

  return (
    <PublicLayout
      clinicName={data?.config?.clinic_name}
      logoUrl={data?.config?.branding?.logo_url}
      branches={data?.config?.branches}
      contact={data?.config?.contact}
      social={data?.config?.social}
      policies={data?.config?.policies}
      seo={data?.config?.seo}
      features={data?.config?.features || { enable_blog: false, enable_faq: false }}
      footer_description={data?.config?.footer_description}
    >
      {content}
    </PublicLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
