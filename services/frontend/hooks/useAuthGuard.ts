

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardResult {
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuthGuard(): AuthGuardResult {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/validate', {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          
          router.replace("/login");
        }
      } catch {
        
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  return { isLoading, isAuthenticated };
}
