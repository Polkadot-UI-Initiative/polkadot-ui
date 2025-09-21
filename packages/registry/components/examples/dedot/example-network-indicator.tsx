import type { ComponentExample } from "../types.examples";
import { NetworkIndicator } from "@/registry/polkadot-ui/blocks/network-indicator/network-indicator.dedot";
import { paseo, paseoPeople, polkadot } from "typink";

export const networkIndicatorExample: ComponentExample = {
  name: "Network Indicator",
  href: "/docs/components/network-indicator",
  code: "network-indicator",
  description: "Show current network and status",
  component: (
    <div className="flex items-center gap-2 flex-col">
      <NetworkIndicator chainId={paseo.id} at="best" />
      <NetworkIndicator chainId={paseoPeople.id} at="finalized" />
      <NetworkIndicator chainId={polkadot.id} at="best" />
    </div>
  ),
  tsx: `import { NetworkIndicator } from "@/components/network-indicator.dedot";
import { paseo, paseoPeople, polkadot } from "typink";

<div className="flex items-center gap-2 flex-col">
  <NetworkIndicator chainId={paseo.id} at="best" />
  <NetworkIndicator chainId={paseoPeople.id} at="finalized" />
  <NetworkIndicator chainId={polkadot.id} at="best" />
</div>`,
};
