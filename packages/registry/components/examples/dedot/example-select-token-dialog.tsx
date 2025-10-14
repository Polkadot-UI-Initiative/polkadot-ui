import type { ComponentExample } from "@/components/examples/types.examples";
import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

export const selectTokenDialogExample: ComponentExample = {
  name: "Select Token Dialog",
  href: "/docs/components/select-token-dialog",
  code: "select-token-dialog",
  description:
    "Token selection dialog with search (by name or symbol) and balances display",
  component: (
    <div className="w-[260px]">
      <SelectTokenDialog
        chainId={paseoAssetHub.id}
        assetIds={[-1, 1984, 1337]} // -1 for native token
        className="w-full"
        withBalance
        withSearch
      />
    </div>
  ),
  tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

<div className="w-[260px]">
  <SelectTokenDialog
    chainId={paseoAssetHub.id}
    assetIds={[-1, 1984, 1337]} // -1 for native token
    className="w-full"
    withBalance
    withSearch
    balancePrecision={3}
  />
</div>`,
};
