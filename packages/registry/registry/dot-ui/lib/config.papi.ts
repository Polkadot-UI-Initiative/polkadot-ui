// To add more chains, run: npx papi add <chain-name> -n <chain-name>
// Then import the descriptor here and add it to the chains configuration
import { paseo, paseo_people } from "@polkadot-api/descriptors";
import { dotUiConfig } from "@/registry/dot-ui/lib/config.dot-ui";
import { extendDotUiConfig } from "@/registry/dot-ui/lib/utils.dot-ui";

// PAPI-specific configuration that extends the base config with descriptors
export const polkadotConfig = extendDotUiConfig(dotUiConfig, {
  chains: {
    paseo: { descriptor: paseo },
    paseo_people: { descriptor: paseo_people },
  },
});
