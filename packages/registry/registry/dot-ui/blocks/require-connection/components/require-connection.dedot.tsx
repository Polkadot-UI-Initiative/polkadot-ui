"use client";

import { useMemo } from "react";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
// NetworkId intentionally not used here; using SupportedChainId for autocomplete
import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "./require-connection.base";
import { ClientConnectionStatus, NetworkId, usePolkadotClient } from "typink";
import { ClientOnly } from "@/components/client-only";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps,
  "services"
>;

function RequireConnectionInner(props: RequireConnectionProps) {
  const { status } = usePolkadotClient(props.chainId);

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

export function RequireConnection(props: RequireConnectionProps) {
  return (
    <ClientOnly>
      <RequireConnectionInner {...props} />
    </ClientOnly>
  );
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
