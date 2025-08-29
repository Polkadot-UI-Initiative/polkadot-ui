import { dotUiConfig } from "@/registry/dot-ui/lib/config.dot-ui";
import { extendDotUiConfig } from "@/registry/dot-ui/lib/utils.dot-ui";
import { paseo, paseoPeople, type NetworkInfo } from "typink";

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
