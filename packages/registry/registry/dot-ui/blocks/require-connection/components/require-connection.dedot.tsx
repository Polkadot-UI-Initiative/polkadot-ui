"use client";

import { ClientOnly } from "@/registry/dot-ui/blocks/client-only";
import {
  RequireConnectionBase,
  type RequireConnectionBaseProps,
} from "@/registry/dot-ui/blocks/require-connection/components/require-connection.base";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { useMemo } from "react";
import {
  type NetworkId,
  ClientConnectionStatus,
  usePolkadotClient,
} from "typink";

// Props type - removes services prop since we inject it
export type RequireConnectionProps = Omit<
  RequireConnectionBaseProps,
  "services"
>;

function RequireConnectionInner(props: RequireConnectionProps) {
  const { status } = usePolkadotClient(props.chainId);

  const services = useMemo(
    () => ({
      isLoading: status === ClientConnectionStatus.Connecting,
      isConnected: status === ClientConnectionStatus.Connected,
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
