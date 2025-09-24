import type { ComponentExample } from "../types.examples";
import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";
import { paseoAssetHub } from "typink";

export const selectTokenExample: ComponentExample = {
  name: "Select Token",
  href: "/docs/components/select-token",
  code: "select-token",
  description: "Token selection with balances",
  component: (
    <div className="w-[260px]">
      <SelectToken
        chainId={paseoAssetHub.id}
        assetIds={[1984, 1337, 7777]}
        className="w-full"
        withBalance
      />
    </div>
  ),
  tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";
import { paseoAssetHub } from "typink";

<div className="w-[260px]">
  <SelectToken
    chainId={paseoAssetHub.id}
    assetIds={[1984, 1337, 7777]}
    className="w-full"
    withBalance
  />
</div>`,
};
