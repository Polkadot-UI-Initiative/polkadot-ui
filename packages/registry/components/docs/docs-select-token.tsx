"use client";

import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";
import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/components/select-token-dialog.dedot";
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
    name: "Select Token - With Balance",
    href: "/docs/components/select-token",
    code: "select-token",
    description: "Token selection with balance display for connected accounts",
    component: (
      <SelectToken
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={true}
        className="w-[260px]"
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";
import { paseoAssetHub } from "typink";

<SelectToken
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={true}
  className="w-[260px]"
/>`,
  },
  {
    name: "Select Token - Without Balance",
    code: "select-token",
    description: "Token selection without balance information",
    component: (
      <SelectToken
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={false}
        className="w-[260px]"
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";
import { paseoAssetHub } from "typink";

<SelectToken
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={false}
  className="w-[260px]"
/>`,
  },
  {
    name: "Select Token - Exclude Native Token",
    code: "select-token",
    description: "Token selection excluding the native chain token",
    component: (
      <SelectToken
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={true}
        includeNative={false}
        className="w-[260px]"
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";
import { paseoAssetHub } from "typink";

<SelectToken
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={true}
  includeNative={false}
  className="w-[260px]"
/>`,
  },
  {
    name: "Select Token - onChange Callback",
    code: "select-token",
    description: "Trigger a callback when token selection changes",
    component: (
      <SelectToken
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={true}
        onChange={handleTokenChange}
        className="w-[260px]"
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";
import { paseoAssetHub } from "typink";

<SelectToken
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={true}
  onChange={(assetId) => console.log("Selected:", assetId)}
  className="w-[260px]"
/>`,
  },
  {
    name: "Select Token Dialog - With Search",
    code: "select-token-dialog",
    description: "Dialog-based token selection with search functionality",
    component: (
      <SelectTokenDialog
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777, 8, 27]}
        withBalance={true}
        withSearch={true}
        className="w-[260px]"
      />
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/components/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<SelectTokenDialog
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777, 8, 27]}
  withBalance={true}
  withSearch={true}
  className="w-[260px]"
/>`,
  },
  {
    name: "Select Token Dialog - Compact Mode",
    code: "select-token-dialog",
    description: "Compact dialog-based token selection",
    component: (
      <SelectTokenDialog
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={true}
        compact={true}
        className="w-fit"
      />
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/components/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<SelectTokenDialog
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={true}
  compact={true}
  className="w-fit"
/>`,
  },
  {
    name: "Select Token Dialog - Custom Balance Precision",
    code: "select-token-dialog",
    description: "Dialog with custom balance precision formatting",
    component: (
      <SelectTokenDialog
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance={true}
        balancePrecision={4}
        className="w-[260px]"
      />
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/components/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<SelectTokenDialog
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance={true}
  balancePrecision={4}
  className="w-[260px]"
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
