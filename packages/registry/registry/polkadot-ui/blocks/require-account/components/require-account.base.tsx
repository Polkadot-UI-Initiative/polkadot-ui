"use client";

import { type ReactNode } from "react";

export interface RequireAccountServices {
  isLoading: boolean;
  hasAccount: boolean;
}

export interface RequireAccountBaseProps<TChainId extends string = string> {
  chainId: TChainId;
  children: ReactNode;
  fallback: ReactNode;
  loadingFallback?: ReactNode;
  services: RequireAccountServices;
}

export function RequireAccountBase<TChainId extends string = string>({
  children,
  fallback,
  loadingFallback,
  services,
}: RequireAccountBaseProps<TChainId>) {
  const { isLoading, hasAccount } = services;

  if (isLoading && loadingFallback) return <>{loadingFallback}</>;

  return <>{hasAccount ? children : fallback}</>;
}

RequireAccountBase.displayName = "RequireAccountBase";
