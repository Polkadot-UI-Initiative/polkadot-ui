import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.dedot";
import type { ComponentExample } from "../types.examples";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { polkadotAssetHub } from "typink";
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";

export const amountInputExample: ComponentExample = {
  name: "Amount Input",
  href: "/docs/components/amount-input",
  code: "amount-input",
  description: "Input component for entering amounts",
  component: (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="amount">Amount</Label>
      <AmountInput
        id="amount"
        chainId={polkadotAssetHub.id}
        assetId={NATIVE_TOKEN_KEY}
        className="w-full"
        placeholder="Enter an amount"
      />
      <AmountInput
        id="amount"
        chainId={polkadotAssetHub.id}
        assetId={1337}
        className="w-full"
        placeholder="Enter an amount"
      />
    </div>
  ),
};
