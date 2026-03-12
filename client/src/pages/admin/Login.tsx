import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LoginSchema } from "@shared/schema";

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" }
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] -left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] -right-10 w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 mb-6">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mt-2">Manage your clinic's digital presence</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  {...form.register("username")}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="admin"
                />
              </div>
              {form.formState.errors.username && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password"
                  {...form.register("password")}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold tracking-wide shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 hover:bg-primary/95 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>For demo purposes use any username/password combination if not strict.</p>
        </div>
      </div>
    </div>
  );
}
