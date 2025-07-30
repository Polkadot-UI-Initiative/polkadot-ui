"use client";

import { useMemo } from "react";
import {
  PolkadotProvider,
  useDedot,
} from "@/registry/dot-ui/providers/dedot-provider";
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
  const dedotContext = useDedot();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useProvider: () => ({
        isLoading: dedotContext.isLoading,
        isConnected: dedotContext.isConnected,
      }),
    }),
    [dedotContext]
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
