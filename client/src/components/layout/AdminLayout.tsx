import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  LayoutDashboard,
  Settings,
  LogOut,
  Globe,
  Clock,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
    { href: "/admin/appointments", label: "Appointments", icon: Clock },
    { href: "/admin/messages", label: "Messages", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 text-primary"
          >
            <Activity className="w-7 h-7" />
            <span className="text-xl font-bold font-display tracking-tight text-slate-900">
              MedPanel
            </span>
          </Link>
        </div>

        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200
                  ${isActive ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
                `}
                >
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-primary" : "text-slate-400"}`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-slate-900 truncate">
                {user?.username}
              </div>
              <div className="text-xs text-slate-500 capitalize">
                {user?.role}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold font-display text-slate-800">
            {navItems.find((i) => i.href === location)?.label || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-sm"
            >
              <Globe className="w-4 h-4" />
              View Live Site
            </Link>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
