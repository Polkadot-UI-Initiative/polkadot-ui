"use client";

import { selectTokenDialogExample } from "@/components/examples/dedot/example-select-token-dialog";
import type { ComponentExample } from "@/components/examples/types.examples";
import { ComponentPreview } from "@/components/layout/component-preview";
import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { polkadotAssetHub } from "typink";

export const selectTokenDialogExamples: ComponentExample[] = [
  selectTokenDialogExample,
  {
    name: "Select Token Dialog - Custom Variants",
    code: "select-token-dialog",
    description:
      "Dialog with customizable button variants and styling: secondary (top) and outline (bottom)",
    component: (
      <div className="flex flex-col gap-2 w-full">
        <SelectTokenDialog
          chainId={polkadotAssetHub.id}
          assetIds={[-1, 1984, 1337]} // -1 for native token
          withBalance
          connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
          variant="secondary"
        />
        <SelectTokenDialog
          chainId={polkadotAssetHub.id}
          assetIds={[-1, 1984, 1337]}
          withBalance
          connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
          variant="outline"
        />
      </div>
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<div className="flex flex-col gap-2 w-full">
  <SelectTokenDialog
    chainId={paseoAssetHub.id}
    assetIds={[-1, 1984, 1337]} // -1 for native token
    withBalance
    connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
    variant="secondary"
  />
  <SelectTokenDialog
    chainId={paseoAssetHub.id}
    assetIds={[-1, 1984, 1337]}
    withBalance
    connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
    variant="outline"
  />
</div>`,
  },
  {
    name: "Select Token Dialog - Exclude Native Token",
    code: "select-token-dialog",
    description: "Dialog excluding the native chain token",
    component: (
      <SelectTokenDialog
        className="w-[260px]"
        chainId={polkadotAssetHub.id}
        assetIds={[1984, 1337]}
        withBalance
        connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
      />
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<SelectTokenDialog
  className="w-[260px]"
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337]}
  withBalance
  connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
/>`,
  },
  {
    name: "Select Token Dialog - Custom Balance Precision",
    code: "select-token-dialog",
    description:
      "Dialog with custom balance precision formatting (4 decimal places)",
    component: (
      <SelectTokenDialog
        className="w-[260px]"
        chainId={polkadotAssetHub.id}
        assetIds={[-1, 1984, 1337]}
        withBalance
        connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
        balancePrecision={4}
      />
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<SelectTokenDialog
  className="w-[260px]"
  chainId={paseoAssetHub.id}
  assetIds={[-1, 1984, 1337]}
  withBalance
  connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
  balancePrecision={4}
/>`,
  },
  {
    name: "Select Token Dialog - Compact Mode",
    code: "select-token-dialog",
    description: "Compact display for selected token, only showing the logo",
    component: (
      <div className="flex justify-center items-center">
        <SelectTokenDialog
          className="w-fit"
          chainId={polkadotAssetHub.id}
          assetIds={[-1, 1984, 1337]}
          withBalance
          connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
          compact={true}
        />
      </div>
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<SelectTokenDialog
  className="w-fit"
  chainId={paseoAssetHub.id}
  assetIds={[-1, 1984, 1337]}
  withBalance
  connectedAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
  compact={true}
/>`,
  },
];

export function SelectTokenDialogDocs() {
  return (
    <div className="not-prose">
      <PolkadotProvider>
        <div className="flex flex-col gap-4">
          {selectTokenDialogExamples.map((example) => (
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
