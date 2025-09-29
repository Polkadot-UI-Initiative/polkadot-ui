"use client";

import {
  type ContractDeployment,
  type NetworkId,
  type NetworkInfo,
  paseo,
  paseoAssetHub,
  paseoPeople,
  polkadot,
  polkadotAssetHub,
  polkadotPeople,
  TypinkProvider,
} from "typink";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const SUPPORTED_NETWORKS = [
  paseo,
  paseoAssetHub,
  paseoPeople,
  polkadot,
  polkadotAssetHub,
  polkadotPeople,
];

const queryClient = new QueryClient();

export function PolkadotProvider({
  children,
  appName = "Polkadot UI App",
  defaultCaller = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  supportedNetworks = SUPPORTED_NETWORKS,
}: {
  children: React.ReactNode;
  appName?: string;
  defaultCaller?: string;
  defaultNetworkId?: NetworkId;
  deployments?: ContractDeployment[];
  supportedNetworks?: NetworkInfo[];
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TypinkProvider
        appName={appName}
        defaultCaller={defaultCaller}
        supportedNetworks={supportedNetworks}
        defaultNetworkIds={supportedNetworks.map((network) => network.id)}
        cacheMetadata={true}
      >
        {children}
      </TypinkProvider>
    </QueryClientProvider>
  );
}
