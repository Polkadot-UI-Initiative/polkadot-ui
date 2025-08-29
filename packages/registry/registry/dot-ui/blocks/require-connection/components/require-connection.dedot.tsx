"use client";

import { useMemo } from "react";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
// NetworkId intentionally not used here; using SupportedChainId for autocomplete
import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "./require-connection.base";
import { ClientConnectionStatus, NetworkId, usePolkadotClient } from "typink";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps,
  "services"
>;

export function RequireConnection(props: RequireConnectionProps) {
  const { status } = usePolkadotClient(props.chainId);

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useProvider: () => ({
        isLoading: status === ClientConnectionStatus.Connecting,
        isConnected: status === ClientConnectionStatus.Connected,
      }),
    }),
    [status]
  );

  return <RequireConnectionBase<NetworkId> {...props} services={services} />;
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
