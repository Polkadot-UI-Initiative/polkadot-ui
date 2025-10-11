"use client";

import { selectTokenDialogExample } from "@/components/examples/dedot/example-select-token-dialog";
import type { ComponentExample } from "@/components/examples/types.examples";
import { ComponentPreview } from "@/components/layout/component-preview";
import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { paseoAssetHub } from "typink";

export const selectTokenDialogExamples: ComponentExample[] = [
  selectTokenDialogExample,
  {
    name: "Select Token Dialog - Custom Variants",
    code: "select-token-dialog",
    description: "Dialog with different button variants and styling",
    component: (
      <div className="flex gap-4">
        <SelectTokenDialog
          className="w-[200px]"
          chainId={paseoAssetHub.id}
          assetIds={[1984, 1337, 7777]}
          withBalance
          variant="secondary"
        />
        <SelectTokenDialog
          className="w-[200px]"
          chainId={paseoAssetHub.id}
          assetIds={[1984, 1337, 7777]}
          withBalance
          variant="outline"
        />
      </div>
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<div className="flex gap-4">
  <SelectTokenDialog
    className="w-[200px]"
    chainId={paseoAssetHub.id}
    assetIds={[1984, 1337, 7777]}
    withBalance
    variant="secondary"
  />
  <SelectTokenDialog
    className="w-[200px]"
    chainId={paseoAssetHub.id}
    assetIds={[1984, 1337, 7777]}
    withBalance
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
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance
      />
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<SelectTokenDialog
  className="w-[260px]"
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance
  includeNative={false}
/>`,
  },
  {
    name: "Select Token Dialog - Custom Balance Precision",
    code: "select-token-dialog",
    description: "Dialog with custom balance precision formatting",
    component: (
      <SelectTokenDialog
        className="w-[260px]"
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        withBalance
        balancePrecision={4}
      />
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<SelectTokenDialog
  className="w-[260px]"
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance
  balancePrecision={4}
/>`,
  },
  {
    name: "Select Token Dialog - Compact Mode",
    code: "select-token-dialog",
    description: "Compact dialog-based token selection",
    component: (
      <div className="flex justify-center items-center">
        <SelectTokenDialog
          className="w-fit"
          chainId={paseoAssetHub.id}
          assetIds={[1984, 1337, 7777]}
          withBalance
          compact={true}
        />
      </div>
    ),
    tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<SelectTokenDialog
  className="w-fit"
  chainId={paseoAssetHub.id}
  assetIds={[1984, 1337, 7777]}
  withBalance
  compact={true}
/>`,
  },
];

export function SelectTokenDialogDocs() {
  return (
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
  );
}
