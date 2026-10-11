import { Navigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Role } from "@/data/data";
import { useCurrentUser, useHydrated } from "@/lib/store";

// Só renderiza os filhos com sessão iniciada (e o papel certo, se indicado).
export function RequireAuth({ roles, children }: { roles?: Role[]; children: ReactNode }) {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const href = useRouterState({ select: (s) => s.location.href });
  if (!hydrated) return null;
  if (!user) return <Navigate to="/login" search={{ redirect: href }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
