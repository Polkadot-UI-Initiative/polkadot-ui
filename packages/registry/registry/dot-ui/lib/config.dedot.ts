import { dotUiConfig, type ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import { extendDotUiConfig } from "@/registry/dot-ui/lib/utils.dot-ui";
import { paseo, paseoPeople, type NetworkInfo, type NetworkId } from "typink";

// Extend base config with Typink NetworkInfo per chain
export const dedotConfig = extendDotUiConfig(dotUiConfig, {
  chains: {
    paseo: { network: paseo },
    paseo_people: { network: paseoPeople },
  },
});

// Export supported networks array for <TypinkProvider /> and consumers
export const dedotSupportedNetworks = Object.values(dedotConfig.chains).map(
  (c) => c.network
) as NetworkInfo[];

// Mappings between base ChainId and Typink Network identifiers
export const chainIdToNetworkInfo: Readonly<Record<ChainId, NetworkInfo>> = {
  paseo: dedotConfig.chains.paseo.network,
  paseo_people: dedotConfig.chains.paseo_people.network,
} as const;

export function toTypinkId(chainId: ChainId): NetworkId {
  return chainIdToNetworkInfo[chainId].id;
}

export function fromTypinkId(networkId: NetworkId): ChainId | null {
  const entry = Object.entries(chainIdToNetworkInfo).find(
    ([, info]) => info.id === networkId
  );
  return (entry?.[0] as ChainId | undefined) ?? null;
}
