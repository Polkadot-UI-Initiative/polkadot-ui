import type { ComponentExample } from "../types.examples";
import { SelectTokenWithProvider } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";
import { paseoAssetHub } from "typink";

export const selectTokenExample: ComponentExample = {
  name: "Select Token",
  href: "/docs/components/select-token",
  code: "select-token",
  description: "Token selection with search and balances",
  component: (
    <div className="w-[260px]">
      {/* Asset Hub Paseo sample IDs from Substrate Assets explorer */}
      <SelectTokenWithProvider
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        className="w-full"
        withBalance
        disabled={false}
      />
    </div>
  ),
};
