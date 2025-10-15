"use client";

import type { ComponentExample } from "@/components/examples/types.examples";
import { ComponentPreview } from "@/components/layout/component-preview";
import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { polkadotAssetHub } from "typink";

const handleTokenChange = (assetId: number) => {
  console.log("Selected token:", assetId);
};

export const selectTokenExamples: ComponentExample[] = [
  {
    name: "Select Token - Without Balance",
    code: "select-token",
    description:
      "Dropdown without balance information, useful for token selection in basic contexts",
    component: (
      <SelectToken
        className="w-[260px]"
        chainId={polkadotAssetHub.id}
        assetIds={[-1, 1984, 1337]} // -1 for native token
        withBalance={false}
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { polkadotAssetHub } from "typink";

<SelectToken
  className="w-[260px]"
  chainId={polkadotAssetHub.id}
  assetIds={[-1, 1984, 1337]}
  withBalance={false}
/>`,
  },
  {
    name: "Select Token - Exclude Native Token",
    code: "select-token",
    description: "Dropdown excluding the native chain token",
    component: (
      <SelectToken
        className="w-[260px]"
        chainId={polkadotAssetHub.id}
        assetIds={[1984, 1337]} // -1 assetId isn't included
        withBalance={true}
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { polkadotAssetHub } from "typink";

<SelectToken
  className="w-[260px]"
  chainId={polkadotAssetHub.id}
  assetIds={[1984, 1337]}
  withBalance={true}
/>`,
  },
  {
    name: "Select Token - onChange Callback",
    code: "select-token",
    description:
      "Dropdown with onChange callback to handle token selection events",
    component: (
      <SelectToken
        className="w-[260px]"
        chainId={polkadotAssetHub.id}
        assetIds={[-1, 1984, 1337]}
        withBalance={true}
        onChange={handleTokenChange}
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { polkadotAssetHub } from "typink";

<SelectToken
  className="w-[260px]"
  chainId={polkadotAssetHub.id}
  assetIds={[-1, 1984, 1337]}
  withBalance={true}
  onChange={(assetId) => console.log("Selected:", assetId)}
/>`,
  },
  {
    name: "Select Token - Custom Balance Precision",
    code: "select-token",
    description:
      "Dropdown with custom balance precision formatting (4 decimal places)",
    component: (
      <SelectToken
        className="w-[260px]"
        chainId={polkadotAssetHub.id}
        assetIds={[1984, 1337]}
        withBalance={true}
        balancePrecision={4}
      />
    ),
    tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.dedot";
import { polkadotAssetHub } from "typink";

<SelectToken
  className="w-[260px]"
  chainId={polkadotAssetHub.id}
  assetIds={[1984, 1337]}
  withBalance={true}
  balancePrecision={4}
/>`,
  },
];

export function SelectTokenDocs() {
  return (
    <div className="not-prose">
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
    </div>
  );
}
