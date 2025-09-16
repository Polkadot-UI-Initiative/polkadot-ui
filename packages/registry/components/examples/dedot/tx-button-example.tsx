import { DemoTxButton } from "./example-tx-button";
import type { ComponentExample } from "../types.examples";

export const txButtonExample: ComponentExample = {
  name: "Tx Button",
  href: "/docs/components/tx-button",
  code: "tx-button",
  description:
    "Button component for sending arbitrary transactions. Supports all chains, all signers with default notification. Fees and error states are handled by the component.",
  component: <DemoTxButton />,
};
