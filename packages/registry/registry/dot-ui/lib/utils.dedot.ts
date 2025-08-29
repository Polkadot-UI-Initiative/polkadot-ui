import { dedotConfig } from "@/registry/dot-ui/lib/config.dedot";
import type { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import type { NetworkId } from "typink";

export function toTypinkId(chainId: ChainId): NetworkId {
  return dedotConfig.chains[chainId].network.id;
}

export function fromTypinkId(networkId: NetworkId): ChainId | null {
  for (const [id, cfg] of Object.entries(dedotConfig.chains)) {
    if (cfg.network.id === networkId) return id as ChainId;
  }
  return null;
}
