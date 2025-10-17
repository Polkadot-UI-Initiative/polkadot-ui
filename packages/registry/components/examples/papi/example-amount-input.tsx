"use client";

import type { ComponentExample } from "@/components/examples/types.examples";
import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.papi";
import { useSubscanDotPrice } from "@/registry/polkadot-ui/hooks/use-subscan-dot-price";

function PapiAmountInputWithPrice() {
  const { data: price } = useSubscanDotPrice();
  return (
    <AmountInput chainId="polkadot" tokenConversionRate={price ?? undefined} />
  );
}

export const amountInputExample: ComponentExample = {
  name: "Amount Input",
  href: "/docs/components/amount-input",
  code: "amount-input",
  description: "Input component for entering amounts",
  component: <PapiAmountInputWithPrice />,
  tsx: `import { AmountInput } from "@/components/amount-input.papi";
import { useSubscanDotPrice } from "@/registry/polkadot-ui/hooks/use-subscan-dot-price";

function PapiAmountInputWithPrice() {
  const { data: price } = useSubscanDotPrice();
  return (
    <AmountInput chainId="polkadot" tokenConversionRate={price ?? undefined} />
  );
}

<PapiAmountInputWithPrice />`,
};
