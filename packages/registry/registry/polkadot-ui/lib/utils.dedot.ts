import { dedotConfig } from "@/registry/polkadot-ui/lib/config.dedot";
import type { ChainId } from "@/registry/polkadot-ui/lib/config.dot-ui";
import { paseoPeople, type NetworkId } from "typink";

export function toTypinkId(chainId: ChainId): NetworkId {
  return dedotConfig.chains[chainId].network.id;
}

export function fromTypinkId(networkId: NetworkId): ChainId | null {
  for (const [id, cfg] of Object.entries(dedotConfig.chains)) {
    if (cfg.network.id === networkId) return id as ChainId;
  }
  return null;
}

export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
export function getIdentityNetworkId(identityChain?: string): string {
  if (identityChain) {
    return camelToSnakeCase(identityChain);
  }

  // Default fallback for identity chain
  return paseoPeople.id;
}
