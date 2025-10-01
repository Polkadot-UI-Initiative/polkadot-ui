"use client";

import { type ReactNode } from "react";

export interface RequireAccountServices {
  hasAccount: boolean;
}

export interface RequireAccountBaseProps {
  children: ReactNode;
  fallback: ReactNode;
  loadingFallback?: ReactNode;
  services: RequireAccountServices;
}

export function RequireAccountBase({
  children,
  fallback,
  loadingFallback,
  services,
}: RequireAccountBaseProps) {
  const { hasAccount } = services;

  if (loadingFallback) return <>{loadingFallback}</>;

  return <>{hasAccount ? children : fallback}</>;
}
