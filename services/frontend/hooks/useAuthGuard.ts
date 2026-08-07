

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardResult {
  isLoading: boolean;
  isAuthenticated: boolean;
  username: string | null;
  role: string | null;
  userId: string | null;
}

interface ValidateResponse {
  user?: { user_id?: string; username?: string; role?: string | null };
}

export function useAuthGuard(): AuthGuardResult {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/validate', {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAuthenticated(true);
          const data: ValidateResponse = await res.json();
          setUsername(data.user?.username ?? null);
          setRole(data.user?.role ?? null);
          setUserId(data.user?.user_id ?? null);
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

  return { isLoading, isAuthenticated, username, role, userId };
}
