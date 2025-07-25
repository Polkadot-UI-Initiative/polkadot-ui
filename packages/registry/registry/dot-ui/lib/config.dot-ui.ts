import { DotUiConfig, SubstrateExplorer } from "./types.dot-ui";

export const dotUiConfig: DotUiConfig = {
  chains: {
    paseo: {
      endpoints: ["wss://sys.ibp.network/paseo", "wss://paseo.dotters.network"],
      displayName: "Paseo Relay Chain",
      explorerUrls: {
        [SubstrateExplorer.PolkadotJs]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent("wss://sys.ibp.network/paseo")}#/explorer`,
        [SubstrateExplorer.Subscan]: `https://paseo.subscan.io/`,
      },
      isTestnet: true,
    },
    paseo_people: {
      endpoints: ["wss://sys.ibp.network/people-paseo"],
      displayName: "Paseo People",
      explorerUrls: {
        [SubstrateExplorer.PolkadotJs]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent("wss://sys.ibp.network/people-paseo")}#/explorer`,
        [SubstrateExplorer.Subscan]: `https://people-paseo.subscan.io/`,
      },
      isTestnet: true,
    },
  },
  defaultChain: "paseo",
};

// Simple type aliases for type safety
export type ChainId = keyof typeof dotUiConfig.chains;
export type ChainConfig<T extends ChainId> = (typeof dotUiConfig.chains)[T];
