"use client";

import type { ComponentExample } from "../examples/types.examples";
import { ComponentPreview } from "../layout/component-preview";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { networkIndicatorExample } from "../examples/dedot/example-network-indicator";
import { NetworkIndicator } from "@/registry/polkadot-ui/blocks/network-indicator/network-indicator.dedot";
import { paseo, paseoPeople, polkadot } from "typink";

export const networkIndicatorExamples: ComponentExample[] = [
  networkIndicatorExample,
  {
    name: "Network Indicator (no block number)",
    href: "/docs/components/network-indicator",
    code: "network-indicator-hide-number",
    description: "Hide the live block number",
    component: (
      <div className="flex items-center gap-4 flex-col">
        <NetworkIndicator
          chainId={paseoPeople.id}
          at="finalized"
          showBlockNumber={false}
        />
      </div>
    ),
    tsx: `import { NetworkIndicator } from "@/components/network-indicator.dedot";
import { paseoPeople } from "typink";

<div className="flex items-center gap-4 flex-col">
  <NetworkIndicator chainId={paseoPeople.id} at="finalized" showBlockNumber={false} />
</div>`,
  },
  {
    name: "Network Indicator (no logo)",
    href: "/docs/components/network-indicator",
    code: "network-indicator-no-logo",
    description: "Hide the network logo",
    component: (
      <div className="flex items-center gap-4 flex-col">
        <NetworkIndicator chainId={polkadot.id} at="best" showLogo={false} />
      </div>
    ),
    tsx: `import { NetworkIndicator } from "@/components/network-indicator.dedot";
import { polkadot } from "typink";

<div className="flex items-center gap-4 flex-col">
  <NetworkIndicator chainId={polkadot.id} at="best" showLogo={false} />
</div>`,
  },
  {
    name: "Network Indicator (finalized)",
    href: "/docs/components/network-indicator",
    code: "network-indicator-finalized",
    description: "Follow the finalized head instead of best",
    component: (
      <div className="flex items-center gap-4 flex-col">
        <NetworkIndicator chainId={paseo.id} at="finalized" />
      </div>
    ),
    tsx: `import { NetworkIndicator } from "@/components/network-indicator.dedot";
import { paseo } from "typink";

<div className="flex items-center gap-4 flex-col">
  <NetworkIndicator chainId={paseo.id} at="finalized" />
</div>`,
  },
];

export function NetworkIndicatorDocs() {
  return (
    <div className="not-prose">
      <PolkadotProvider>
        <div className="flex flex-col gap-4">
          {networkIndicatorExamples.map((example) => (
            <ComponentPreview
              key={example.name}
              componentInfo={example}
              withDocs={false}
            />
          ))}
        </div>
      </PolkadotProvider>
    </div>
  );
}
