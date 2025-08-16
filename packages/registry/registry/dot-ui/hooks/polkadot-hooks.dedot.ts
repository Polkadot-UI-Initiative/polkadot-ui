"use client";

import {
  useTypink,
  type NetworkInfo,
  type InjectedAccount,
  NetworkId,
} from "typink";
import { useDedot } from "../providers/dedot-provider";
import { ChainId } from "../lib/config.dot-ui";

export interface PolkadotHooks {
  useClient: () => ReturnType<typeof useTypink>["client"] | undefined;
  useActiveChainId: () => NetworkId | undefined;
  useActiveChain: () => NetworkInfo | undefined;
  useSupportedNetworks: () => NetworkInfo[];
  useChain: (chainId: ChainId) => NetworkInfo | undefined;
  useIsConnected: () => boolean;
  useSelectedAccount: () => InjectedAccount | undefined;
}

// Selector hooks that read directly from Typink
export function useClient() {
  const { client } = useTypink();
  console.log("client", client);
  return client;
}

export function useActiveChainId() {
  const { currentChainId } = useDedot();
  return currentChainId ?? undefined;
}

export function useActiveChain() {
  const { currentChain } = useDedot();
  return currentChain ?? undefined;
}

export function useChain(chainId: ChainId) {
  const { supportedNetworks } = useTypink();
  return supportedNetworks.find((chain) => chain.id === chainId);
}

export function useSupportedNetworks() {
  const { supportedNetworks } = useTypink();
  return supportedNetworks;
}

export function useIsConnected() {
  const { ready } = useTypink();
  return ready;
}

export function useIsConnectedToChain(chainId: ChainId) {
  const { isConnected } = useDedot();
  return isConnected(chainId);
}

export function useConnectionStatus() {
  const { client } = useTypink();
  return client?.status || "disconnected";
}

export function useSelectedAccount() {
  const { connectedAccount } = useTypink();
  return connectedAccount;
}

export const polkadotHooks: PolkadotHooks = {
  useClient,
  useActiveChainId,
  useChain,
  useActiveChain,
  useSupportedNetworks,
  useIsConnected,
  useSelectedAccount,
};
