"use client";

import { type ReactNode } from "react";

// Services interface for dependency injection
export interface RequireConnectionServices<TChainId extends string = string> {
  // Provider context hook for chain state
  useProvider: () => {
    isLoading: (chainId: TChainId) => boolean;
    isConnected: (chainId: TChainId) => boolean;
  };
}

export interface RequireConnectionBaseProps<TChainId extends string = string> {
  /**
   * The chain ID that must be connected
   */
  chainId: TChainId;
  /**
   * Content to render when the connection is available
   */
  children: ReactNode;
  /**
   * Content to render when the connection is not available
   */
  fallback: ReactNode;
  /**
   * Optional loading content to show while connecting
   */
  loadingFallback?: ReactNode;
  /**
   * Services for dependency injection
   */
  services: RequireConnectionServices<TChainId>;
}

export function RequireConnectionBase<TChainId extends string = string>({
  chainId,
  children,
  fallback,
  loadingFallback,
  services,
}: RequireConnectionBaseProps<TChainId>) {
  const { isLoading, isConnected } = services.useProvider();

  const loading = isLoading(chainId);
  const connected = isConnected(chainId);

  // Show loading state if provided and currently loading
  if (loading && loadingFallback) {
    return <>{loadingFallback}</>;
  }

  // Show children if connected, otherwise show fallback
  return <>{connected ? children : fallback}</>;
}

RequireConnectionBase.displayName = "RequireConnectionBase";
