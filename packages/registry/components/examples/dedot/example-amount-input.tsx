"use client";

import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.dedot";
import type { ComponentExample } from "../types.examples";
import { polkadot } from "typink";
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { useSubscanDotPrice } from "@/registry/polkadot-ui/hooks/use-subscan-dot-price";

function DedotAmountInputWithPrice() {
  const { data: price } = useSubscanDotPrice();
  return (
    <AmountInput
      chainId={polkadot.id}
      assetId={NATIVE_TOKEN_KEY}
      className="w-full"
      tokenConversionRate={price ?? undefined}
    />
  );
}

export const amountInputExample: ComponentExample = {
  name: "Amount Input",
  href: "/docs/components/amount-input",
  code: "amount-input",
  description: "Input component for entering amounts",
  component: <DedotAmountInputWithPrice />,
  tsx: `import { AmountInput } from "@/components/amount-input.dedot";

<AmountInput
  chainId={polkadotAssetHub.id}
  assetId={NATIVE_TOKEN_KEY}
  className="w-full"
/>`,
};
