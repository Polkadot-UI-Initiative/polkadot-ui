"use client";

import { type ReactNode } from "react";
import { type ChainId } from "@/registry/dot-ui/lib/config.dot-ui";

// Services interface for dependency injection
export interface RequireConnectionServices {
  // Provider context hook for chain state
  useProvider: () => {
    isLoading: (chainId: ChainId) => boolean;
    isConnected: (chainId: ChainId) => boolean;
  };
}

export interface RequireConnectionBaseProps {
  /**
   * The chain ID that must be connected
   */
  chainId: ChainId;
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
  services: RequireConnectionServices;
}

export function RequireConnectionBase({
  chainId,
  children,
  fallback,
  loadingFallback,
  services,
}: RequireConnectionBaseProps) {
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
