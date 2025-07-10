import type { ChainConfig } from "@/registry/polkadot-ui/lib/types.polkadot-ui";

// Generic helper functions that work with any polkadot config
export function getChainIds<T extends Record<string, ChainConfig>>(
  chains: T
): (keyof T)[] {
  return Object.keys(chains) as (keyof T)[];
}

export function getChainConfig<
  T extends Record<string, ChainConfig>,
  K extends keyof T
>(chains: T, chainId: K): T[K] {
  return chains[chainId];
}

export function isValidChainId<T extends Record<string, ChainConfig>>(
  chains: T,
  chainId: string
): chainId is string & keyof T {
  return chainId in chains;
}
