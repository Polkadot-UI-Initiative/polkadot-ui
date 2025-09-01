"use client";

import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { ClientConnectionStatus, useTypink } from "typink";

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
      network: {network.name}
      isConnected:{" "}
      {connectionStatus.get("paseo_people") === ClientConnectionStatus.Connected
        ? "true"
        : "false"}
      connectedWalletIds: {connectedWalletIds?.join(", ")}
    </div>
  );
}
