import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.dedot";
import type { ComponentExample } from "../types.examples";
import { polkadotAssetHub } from "typink";
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";

export const amountInputExample: ComponentExample = {
  name: "Amount Input",
  href: "/docs/components/amount-input",
  code: "amount-input",
  description: "Input component for entering amounts",
  component: (
    <AmountInput
      chainId={polkadotAssetHub.id}
      assetId={NATIVE_TOKEN_KEY}
      className="w-full"
      placeholder="Enter an amount"
    />
  ),
  tsx: `import { AmountInput } from "@/components/amount-input.dedot";

<AmountInput
  chainId={polkadotAssetHub.id}
  assetId={NATIVE_TOKEN_KEY}
  className="w-full"
  placeholder="Enter an amount"
/>`,
};
