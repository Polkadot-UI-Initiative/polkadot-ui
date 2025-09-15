import type { ComponentExample } from "../types.examples";
import { NetworkIndicator } from "@/registry/polkadot-ui/blocks/network-indicator/network-indicator.papi";

export const networkIndicatorExample: ComponentExample = {
  name: "Network Indicator",
  href: "/docs/components/network-indicator",
  code: "network-indicator",
  description: "Show current network and status",
  component: <NetworkIndicator chainId="paseo" at="best" />,
};
