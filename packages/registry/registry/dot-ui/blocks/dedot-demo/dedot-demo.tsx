"use client";

import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { ClientConnectionStatus, useTypink, paseoPeople } from "typink";
import { RequireConnection } from "@/registry/dot-ui/blocks/require-connection/components/require-connection.dedot";

export default function DedotDemo() {
  return (
    <PolkadotProvider>
      <List />
    </PolkadotProvider>
  );
}

export function List() {
  const { connectionStatus, network, connectedWalletIds } = useTypink();

  return (
    <div>
      <RequireConnection
        chainId={paseoPeople.id}
        fallback={<div>Loading...</div>}
      >
        <div>
          network: {network.name}
          isConnected:{" "}
          {connectionStatus.get(paseoPeople.id) ===
          ClientConnectionStatus.Connected
            ? "true"
            : "false"}
          connectedWalletIds: {connectedWalletIds?.join(", ")}
        </div>
      </RequireConnection>
    </div>
  );
}
