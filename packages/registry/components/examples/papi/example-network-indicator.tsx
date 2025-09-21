import type { ComponentExample } from "@/components/examples/types.examples";
import { NetworkIndicator } from "@/registry/polkadot-ui/blocks/network-indicator/network-indicator.papi";

export const networkIndicatorExample: ComponentExample = {
  name: "Network Indicator",
  href: "/docs/components/network-indicator",
  code: "network-indicator",
  description: "Show current network and status",
  component: (
    <div className="flex items-center gap-2 flex-col">
      <NetworkIndicator chainId="paseo" at="best" />
      <NetworkIndicator chainId="paseoPeople" at="finalized" />
    </div>
  ),
  tsx: `
    <div className="flex items-center gap-2 flex-col">
      <NetworkIndicator chainId="paseo" at="best" />
      <NetworkIndicator chainId="paseoPeople" at="finalized" />
    </div>
`,
};
