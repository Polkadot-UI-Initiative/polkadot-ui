import type { ComponentExample } from "../types.examples";
import { ExamplePlaceholder } from "@/components/examples/placeholder";

export const transactionDetailsExample: ComponentExample = {
  name: "Transaction Details",
  href: "/docs/components/transaction-details",
  code: "transaction-details",
  description: "Summarize fees, sender, recipient and call data",
  component: <ExamplePlaceholder title="Transaction Details" />,
};
