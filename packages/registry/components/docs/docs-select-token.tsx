"use client";

import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { selectTokenExample } from "@/components/examples/dedot/example-select-token";
import { ComponentExample } from "@/components/examples/types.examples";
import { ComponentPreview } from "@/components/layout/component-preview";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { paseoAssetHub } from "typink";

const handleTokenChange = (assetId: number) => {
  console.log("Selected token:", assetId);
};

export const selectTokenExamples: ComponentExample[] = [
  selectTokenExample,
  {
    name: "Select Token - Without Balance",
    code: "select-token",
    description: "Token selection without balance information",
    component: (
      <SelectToken
        className="w-[260px]"
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={false}
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { paseoAssetHub } from "typink";

<SelectToken
  className="w-[260px]"
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={false}
/>`,
  },
  {
    name: "Select Token - Exclude Native Token",
    code: "select-token",
    description: "Token selection excluding the native chain token",
    component: (
      <SelectToken
        className="w-[260px]"
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={true}
        includeNative={false}
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { paseoAssetHub } from "typink";

<SelectToken
  className="w-[260px]"
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={true}
  includeNative={false}
/>`,
  },
  {
    name: "Select Token - onChange Callback",
    code: "select-token",
    description: "Trigger a callback when token selection changes",
    component: (
      <SelectToken
        className="w-[260px]"
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={true}
        onChange={handleTokenChange}
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { paseoAssetHub } from "typink";

<SelectToken
  className="w-[260px]"
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={true}
  onChange={(assetId) => console.log("Selected:", assetId)}
/>`,
  },
  {
    name: "Select Token - Custom Balance Precision",
    code: "select-token",
    description: "Token selection with custom balance precision formatting",
    component: (
      <SelectToken
        className="w-[260px]"
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={true}
        balancePrecision={4}
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { paseoAssetHub } from "typink";

<SelectToken
  className="w-[260px]"
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={true}
  balancePrecision={4}
/>`,
  },
];

export function SelectTokenDocs() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col gap-4">
        {selectTokenExamples.map((example) => (
          <ComponentPreview
            ComponentWrapper={<div className="w-[300px]"></div>}
            key={example.name}
            componentInfo={example}
            withDocs={false}
          />
        ))}
      </div>
    </PolkadotProvider>
  );
}
