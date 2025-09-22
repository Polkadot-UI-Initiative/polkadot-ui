import type { ComponentExample } from "../types.examples";
import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/components/select-token-dialog.dedot";
import { paseoAssetHub } from "typink";

export const selectTokenDialogExample: ComponentExample = {
  name: "Select Token Dialog",
  href: "/docs/components/select-token-dialog",
  code: "select-token-dialog",
  description: "Token selection dialog with search and balances",
  component: (
    <div className="w-[260px]">
      {/* Asset Hub Paseo sample IDs from Substrate Assets explorer */}
      <SelectTokenDialog
        chainId={paseoAssetHub.id}
        assetIds={[1984, 8, 27]}
        className="w-full"
        withBalance
        balancePrecision={2}
      />
    </div>
  ),
};
