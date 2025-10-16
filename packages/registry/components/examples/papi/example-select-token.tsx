import type { ComponentExample } from "@/components/examples/types.examples";
import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.papi";

export const selectTokenExample: ComponentExample = {
  name: "Select Token",
  href: "/docs/components/select-token",
  code: "select-token",
  description: "Token selection with balances",
  component: (
    <div className="w-[260px]">
      <SelectToken
        chainId="paseoAssetHub"
        assetIds={[-1, 1984, 1337]}
        className="w-full"
        withBalance
      />
    </div>
  ),
  tsx: `import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/select-token.papi";

<div className="w-[260px]">
  <SelectToken
    chainId="paseoAssetHub"
    assetIds={[1984, 1337, 7777]}
    className="w-full"
    withBalance
  />
</div>`,
};
