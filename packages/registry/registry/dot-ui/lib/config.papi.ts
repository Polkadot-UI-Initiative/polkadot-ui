// To add more chains, run: npx papi add <chain-name> -n <chain-name>
// Then import the descriptor here and add it to the chains configuration
import { paseo, paseo_people } from "@polkadot-api/descriptors";
import { dotUiConfig } from "@/registry/dot-ui/lib/config.dot-ui";

// PAPI-specific configuration that extends the base config with descriptors
export const polkadotConfig = {
  ...dotUiConfig,
  chains: {
    paseo: {
      ...dotUiConfig.chains.paseo,
      descriptor: paseo,
    },
    paseo_people: {
      ...dotUiConfig.chains.paseo_people,
      descriptor: paseo_people,
    },
    // Add more chains here after running `npx papi add <chain-name>`
    // Example for adding Polkadot mainnet:
    // 1. Run: npx papi add polkadot -n polkadot
    // 2. Import: import { polkadot } from "@polkadot-api/descriptors";
    // 3. Add configuration:
    // polkadot: {
    //   ...dotUiConfig.chains.polkadot, // if base config exists
    //   descriptor: polkadot,
    //   endpoints: ["wss://polkadot-rpc.publicnode.com"],
    //   displayName: "Polkadot",
    //   isTestnet: false,
    // },
  },
  defaultChain: "paseo" as const,
} as const;
