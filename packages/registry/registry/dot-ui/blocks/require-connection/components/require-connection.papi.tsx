"use client";

import { useMemo } from "react";
import {
  PolkadotProvider,
  usePapi,
} from "@/registry/dot-ui/providers/papi-provider";
import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "./require-connection.base";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps,
  "services"
>;

export function RequireConnection(props: RequireConnectionProps) {
  const { isLoading, isConnected } = usePapi();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useProvider: () => ({
        isLoading,
        isConnected,
      }),
    }),
    [isLoading, isConnected]
  );

  return <RequireConnectionBase {...props} services={services} />;
}

// Wrapped version with provider for drop-in usage
export function RequireConnectionWithProvider(props: RequireConnectionProps) {
  return (
    <PolkadotProvider>
      <RequireConnection {...props} />
    </PolkadotProvider>
  );
}

RequireConnectionWithProvider.displayName = "RequireConnectionWithProvider";
