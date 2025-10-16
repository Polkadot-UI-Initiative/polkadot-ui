import type { ComponentExample } from "@/components/examples/types.examples";
import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.papi";

export const selectTokenDialogExample: ComponentExample = {
  name: "Select Token Dialog",
  href: "/docs/components/select-token-dialog",
  code: "select-token-dialog",
  description: "Token selection dialog with search and balances",
  component: (
    <div className="w-[260px]">
      <SelectTokenDialog
        chainId="paseoAssetHub"
        assetIds={[-1, 1984, 1337]}
        className="w-full"
        withBalance
        withSearch
        balancePrecision={3}
      />
    </div>
  ),
  tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.papi";

<div className="w-[260px]">
  <SelectTokenDialog
    chainId="paseoAssetHub"
    assetIds={[-1, 1984, 1337]}
    className="w-full"
    withBalance
    withSearch
    balancePrecision={3}
  />
</div>`,
};
