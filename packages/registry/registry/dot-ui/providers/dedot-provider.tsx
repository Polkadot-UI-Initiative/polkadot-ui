"use client";

import {
  type ContractDeployment,
  NetworkId,
  type NetworkInfo,
  paseo,
  paseoAssetHub,
  paseoPeople,
  polkadot,
  polkadotPeople,
  TypinkProvider,
} from "typink";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const SUPPORTED_NETWORKS = [
  paseo,
  paseoAssetHub,
  paseoPeople,
  polkadot,
  polkadotPeople,
];

export function PolkadotProvider({
  children,
  appName = "Polkadot UI App",
  defaultCaller = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  supportedNetworks = SUPPORTED_NETWORKS,
  defaultNetworkId,
}: {
  children: React.ReactNode;
  appName?: string;
  defaultCaller?: string;
  defaultNetworkId?: NetworkId;
  deployments?: ContractDeployment[];
  supportedNetworks?: NetworkInfo[];
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TypinkProvider
        appName={appName}
        defaultCaller={defaultCaller}
        supportedNetworks={supportedNetworks}
        defaultNetworkId={defaultNetworkId}
        defaultNetworkIds={supportedNetworks.map((network) => network.id)}
      >
        {children}
      </TypinkProvider>
    </QueryClientProvider>
  );
}
