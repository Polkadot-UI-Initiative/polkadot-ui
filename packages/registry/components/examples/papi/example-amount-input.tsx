import type { ComponentExample } from "@/components/examples/types.examples";
import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.papi";

export const amountInputExample: ComponentExample = {
  name: "Amount Input",
  href: "/docs/components/amount-input",
  code: "amount-input",
  description: "Input component for entering amounts",
  component: <AmountInput chainId="polkadot" />,
};
