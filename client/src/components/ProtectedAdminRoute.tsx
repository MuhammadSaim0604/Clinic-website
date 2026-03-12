import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [, setLocation] = useLocation();
  const [authState, setAuthState] = useState<{ user?: any; checked: boolean }>({
    checked: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });

        if (res.status === 401) {
          setAuthState({ checked: true });
          setLocation("/admin");
        } else if (res.ok) {
          const user = await res.json();
          setAuthState({ user, checked: true });
        }
      } catch (error) {
        console.log("Protected Admin Error :", error);
        setAuthState({ checked: true });
        setLocation("/admin");
      }
    };

    checkAuth();
  }, [setLocation]);

  // Still checking auth
  if (!authState.checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!authState.user) {
    return null;
  }

  // User not admin
  if (authState.user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
