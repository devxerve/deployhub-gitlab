/**
 * useAuthGuard
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprueba si el usuario tiene una sesión activa llamando al endpoint
 * GET /auth/validate del Gateway (NestJS). Ese endpoint a su vez lee la
 * cookie HttpOnly `auth_token` y la valida contra el Auth Service (Express).
 *
 * USO:
 *   const { isLoading, isAuthenticated } = useAuthGuard();
 *
 * - Mientras verifica  → isLoading = true
 * - Sin sesión válida  → redirige automáticamente a /login
 * - Con sesión válida  → isAuthenticated = true
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardResult {
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

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
          // Sin sesión → redirigir al login
          router.replace("/login");
        }
      } catch (err) {
        // Error de red (backend caído, etc.) → también al login
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  return { isLoading, isAuthenticated };
}
