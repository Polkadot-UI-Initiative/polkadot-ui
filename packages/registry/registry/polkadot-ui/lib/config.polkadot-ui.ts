// To add more chains, run: npx papi add <chain-name> -n <chain-name>
// Then import the descriptor here and add it to the chains configuration
import { paseo_asset_hub, paseo } from "@polkadot-api/descriptors";
import { definePolkadotConfig } from "@/registry/polkadot-ui/lib/types.polkadot-ui";

export const polkadotConfig = definePolkadotConfig({
  chains: {
    paseo_asset_hub: {
      descriptor: paseo_asset_hub,
      endpoint: "wss://sys.ibp.network/asset-hub-paseo",
      displayName: "Paseo Asset Hub",
    },
    paseo: {
      descriptor: paseo,
      endpoint: "wss://sys.ibp.network/paseo",
      displayName: "Paseo Relay Chain",
    },
    // Add more chains here after running `npx papi add <chain-name>`
    // Example for adding Polkadot mainnet:
    // 1. Run: npx papi add polkadot -n polkadot
    // 2. Import: import { polkadot } from "@polkadot-api/descriptors";
    // 3. Add configuration:
    // polkadot: {
    //   descriptor: polkadot,
    //   endpoint: "wss://polkadot-rpc.publicnode.com",
    //   displayName: "Polkadot",
    // },
  },
  defaultChain: "paseo_asset_hub",
} as const);

// Simple type aliases for type safety
export type ChainId = keyof typeof polkadotConfig.chains;
export type ChainDescriptor<T extends ChainId> =
  (typeof polkadotConfig.chains)[T]["descriptor"];
