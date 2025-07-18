// To add more chains, run: npx papi add <chain-name> -n <chain-name>
// Then import the descriptor here and add it to the chains configuration
import { paseo_asset_hub, paseo } from "@polkadot-api/descriptors";
import { definePolkadotConfig } from "@/registry/dot-ui/lib/types.polkadot-ui";
import { dotUiConfig } from "./config.dot-ui";

// dedot supports multiple endpoints for automatic failover
// while papi only supports one endpoint so users need to select one manually
export const polkadotConfig = definePolkadotConfig({
  ...dotUiConfig,
  chains: {
    ...dotUiConfig.chains,
    paseo_asset_hub: {
      ...dotUiConfig.chains.paseo_asset_hub,
      descriptor: paseo_asset_hub,
    },
    paseo: {
      ...dotUiConfig.chains.paseo,
      descriptor: paseo,
    },
    // Add more chains here after running `npx papi add <chain-name>`
    // Example for adding Polkadot mainnet:
    // 1. Run: npx papi add polkadot -n polkadot
    // 2. Import: import { polkadot } from "@polkadot-api/descriptors";
    // 3. Add configuration:
    // polkadot: {
    //   descriptor: polkadot,
    //   network: "polkadot",
    //   endpoints: ["wss://polkadot-rpc.publicnode.com"],
    //   displayName: "Polkadot",
    // },
  },
  defaultChain: "paseo_asset_hub",
} as const);

export type ChainId = keyof typeof polkadotConfig.chains;
export type ChainDescriptor<T extends ChainId> =
  (typeof polkadotConfig.chains)[T]["descriptor"];
